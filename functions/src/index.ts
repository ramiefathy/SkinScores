import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';
import { z } from 'zod';

admin.initializeApp();
const db = admin.firestore();

const templateInputSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['number', 'select', 'multiselect', 'boolean', 'text']),
  description: z.string().optional(),
  required: z.boolean().optional(),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        score: z.number().optional(),
      }),
    )
    .optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  weight: z.number().optional(),
});

const templateSchema = z.object({
  name: z.string(),
  slug: z.string(),
  category: z.string(),
  version: z.string(),
  description: z.string(),
  citation: z.string().optional(),
  inputs: z.array(templateInputSchema),
  interpretation: z.object({
    summaryTemplate: z.string(),
    ranges: z.array(
      z.object({
        min: z.number(),
        max: z.number(),
        label: z.string(),
        guidance: z.string(),
      }),
    ),
  }),
  copyBlocks: z.array(
    z.object({
      label: z.string(),
      bodyTemplate: z.string(),
    }),
  ),
});

export type TemplateData = z.infer<typeof templateSchema>;

const calculateScoreRequestSchema = z.object({
  templateSlug: z.string(),
  inputs: z.record(z.any()),
  patientRef: z.string().nullable().optional(),
  sessionId: z.string().optional(),
});

type CalculateScoreRequest = z.infer<typeof calculateScoreRequestSchema>;

const generateExportRequestSchema = z.object({
  sessionIds: z.array(z.string()).min(1).max(25),
});

type GenerateExportRequest = z.infer<typeof generateExportRequestSchema>;

const submitToolResultSchema = z.object({
  toolId: z.string(),
  toolSlug: z.string(),
  toolName: z.string(),
  inputs: z.record(z.any()),
  result: z.object({
    score: z.union([z.number(), z.string()]).nullish(),
    interpretation: z.string(),
    details: z.record(z.any()).optional(),
  }),
  patientRef: z.string().nullable().optional(),
  sessionId: z.string().optional(),
});

type SubmitToolResultRequest = z.infer<typeof submitToolResultSchema>;

export const computeScore = (template: TemplateData, inputs: Record<string, unknown>) => {
  const sanitizedInputs: Record<string, unknown> = {};
  let totalScore = 0;

  template.inputs.forEach((input) => {
    const rawValue = inputs[input.id];
    if ((rawValue === undefined || rawValue === null || rawValue === '') && input.required) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Missing required input "${input.label}"`,
      );
    }

    switch (input.type) {
      case 'number': {
        const numericValue = Number(rawValue);
        if (Number.isNaN(numericValue)) {
          throw new functions.https.HttpsError(
            'invalid-argument',
            `Input "${input.label}" must be a number`,
          );
        }
        if (input.min !== undefined && numericValue < input.min) {
          throw new functions.https.HttpsError(
            'invalid-argument',
            `Input "${input.label}" must be >= ${input.min}`,
          );
        }
        if (input.max !== undefined && numericValue > input.max) {
          throw new functions.https.HttpsError(
            'invalid-argument',
            `Input "${input.label}" must be <= ${input.max}`,
          );
        }
        sanitizedInputs[input.id] = numericValue;
        totalScore += numericValue * (input.weight ?? 1);
        break;
      }
      case 'boolean': {
        const booleanValue = Boolean(rawValue);
        sanitizedInputs[input.id] = booleanValue;
        if (booleanValue) {
          totalScore += input.weight ?? 0;
        }
        break;
      }
      case 'select': {
        if (typeof rawValue !== 'string') {
          throw new functions.https.HttpsError(
            'invalid-argument',
            `Input "${input.label}" must be a string`,
          );
        }
        const option = input.options?.find((opt) => opt.value === rawValue);
        if (!option) {
          throw new functions.https.HttpsError(
            'invalid-argument',
            `Invalid option for "${input.label}"`,
          );
        }
        sanitizedInputs[input.id] = rawValue;
        totalScore += option.score ?? input.weight ?? 0;
        break;
      }
      case 'multiselect': {
        if (!Array.isArray(rawValue)) {
          throw new functions.https.HttpsError(
            'invalid-argument',
            `Input "${input.label}" must be an array`,
          );
        }
        const selectedValues = rawValue.map((value) => String(value));
        sanitizedInputs[input.id] = selectedValues;
        selectedValues.forEach((value) => {
          const option = input.options?.find((opt) => opt.value === value);
          if (!option) {
            throw new functions.https.HttpsError(
              'invalid-argument',
              `Invalid option for "${input.label}"`,
            );
          }
          totalScore += option.score ?? input.weight ?? 0;
        });
        break;
      }
      default: {
        sanitizedInputs[input.id] = rawValue ?? '';
      }
    }
  });

  return { sanitizedInputs, totalScore };
};

const renderTemplate = (template: string, values: Record<string, string | number>) =>
  template.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmed = key.trim();
    const value = values[trimmed];
    return value !== undefined ? String(value) : '';
  });

export const calculateScore = functions
  .region('us-central1')
  .https.onCall(async (data: CalculateScoreRequest, context: functions.https.CallableContext) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication is required.');
    }

    const auth = context.auth;
    const payload = calculateScoreRequestSchema.parse(data);

    const templateSnapshot = await db
      .collection('scoreTemplates')
      .where('slug', '==', payload.templateSlug)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();

    if (templateSnapshot.empty) {
      throw new functions.https.HttpsError('not-found', 'Score template not found.');
    }

    const templateDoc = templateSnapshot.docs[0];
    const template = templateSchema.parse(templateDoc.data());

    const { sanitizedInputs, totalScore } = computeScore(template, payload.inputs);

    const matchingRange = template.interpretation.ranges.find(
      (range) => totalScore >= range.min && totalScore <= range.max,
    );

    const interpretationLabel = matchingRange?.label ?? 'Unclassified';
    const interpretationSummary = matchingRange?.guidance ?? 'No guidance available.';

    const copyBlocks = template.copyBlocks.map((block) =>
      renderTemplate(block.bodyTemplate, {
        score: totalScore,
        interpretationLabel,
        interpretationSummary,
      }),
    );

    const sessionRef = payload.sessionId
      ? db.collection('scoreSessions').doc(payload.sessionId)
      : db.collection('scoreSessions').doc();

    const resultRef = db.collection('scoreResults').doc();

    await db.runTransaction(async (txn) => {
      if (payload.sessionId) {
        const sessionSnapshot = await txn.get(sessionRef);
        if (!sessionSnapshot.exists) {
          throw new functions.https.HttpsError('not-found', 'Session not found.');
        }
        if (sessionSnapshot.get('userId') !== auth.uid) {
          throw new functions.https.HttpsError('permission-denied', 'Cannot modify this session.');
        }
      }

      const now = admin.firestore.FieldValue.serverTimestamp();

      const sessionData = {
        userId: auth.uid,
        templateId: templateDoc.id,
        templateSlug: template.slug,
        templateName: template.name,
        status: 'submitted',
        patientRef: payload.patientRef ?? null,
        inputs: sanitizedInputs,
        score: totalScore,
        interpretationLabel,
        interpretationSummary,
        updatedAt: now,
      } as Record<string, unknown>;

      if (!payload.sessionId) {
        sessionData.createdAt = now;
      }

      txn.set(sessionRef, sessionData, { merge: true });

      txn.set(resultRef, {
        sessionId: sessionRef.id,
        userId: auth.uid,
        templateId: templateDoc.id,
        templateSlug: template.slug,
        templateName: template.name,
        score: totalScore,
        interpretationLabel,
        interpretationSummary,
        copyBlocks,
        createdAt: now,
      });
    });

    return {
      sessionId: sessionRef.id,
      resultId: resultRef.id,
      score: totalScore,
      interpretationLabel,
      interpretationSummary,
      copyBlocks,
    };
  });

export const generateResultExport = functions
  .region('us-central1')
  .https.onCall(async (data: GenerateExportRequest, context: functions.https.CallableContext) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication is required.');
    }

    const auth = context.auth;
    const payload = generateExportRequestSchema.parse(data);
    const isAdmin = auth.token.role === 'admin';

    const chunks: string[][] = [];
    for (let i = 0; i < payload.sessionIds.length; i += 10) {
      chunks.push(payload.sessionIds.slice(i, i + 10));
    }

    const results: Array<{ data: admin.firestore.DocumentData } & { id: string }> = [];

    await Promise.all(
      chunks.map(async (chunk) => {
        const snapshot = await db.collection('scoreResults').where('sessionId', 'in', chunk).get();
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (isAdmin || data.userId === auth.uid) {
            results.push({ id: docSnap.id, data });
          }
        });
      }),
    );

    results.sort((a, b) => {
      const aDate = a.data.createdAt?.toDate?.() ?? new Date();
      const bDate = b.data.createdAt?.toDate?.() ?? new Date();
      return aDate.getTime() - bDate.getTime();
    });

    const text = results
      .map(({ data }) => {
        const name = data.templateName ?? data.templateId;
        const scoreValue =
          typeof data.score === 'number'
            ? data.score
            : (data.scoreText ?? (data.score !== undefined ? String(data.score) : '—'));
        const label = data.interpretationLabel ?? 'Result';
        const summary = data.interpretationSummary ?? '';
        const copyBlocks = Array.isArray(data.copyBlocks) ? data.copyBlocks : [];
        const detailText = data.details ? JSON.stringify(data.details, null, 2) : '';
        return [`${name} — ${scoreValue} (${label})`, summary, ...copyBlocks, detailText]
          .filter(Boolean)
          .join('\n');
      })
      .join('\n\n');

    const csvLines = [
      'sessionId,templateName,score,interpretationLabel,interpretationSummary,details',
    ];
    results.forEach(({ data }) => {
      const scoreValue =
        typeof data.score === 'number'
          ? data.score
          : (data.scoreText ?? (data.score !== undefined ? String(data.score) : ''));
      const detailsValue = data.details ? JSON.stringify(data.details).replace(/\n/g, ' ') : '';
      csvLines.push(
        [
          JSON.stringify(data.sessionId ?? ''),
          JSON.stringify(data.templateName ?? data.templateId ?? ''),
          JSON.stringify(scoreValue ?? ''),
          JSON.stringify(data.interpretationLabel ?? ''),
          JSON.stringify(data.interpretationSummary ?? ''),
          JSON.stringify(detailsValue),
        ].join(','),
      );
    });

    return {
      text,
      csv: csvLines.join('\n'),
    };
  });

const formatDetailValue = (value: unknown): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }
  return String(value);
};

export const submitToolResult = functions
  .region('us-central1')
  .https.onCall(async (data: SubmitToolResultRequest, context: functions.https.CallableContext) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication is required.');
    }

    const auth = context.auth;
    const payload = submitToolResultSchema.parse(data);

    const lazySlug = payload.toolSlug || payload.toolId;

    const sessionRef = payload.sessionId
      ? db.collection('scoreSessions').doc(payload.sessionId)
      : db.collection('scoreSessions').doc();

    const resultRef = db.collection('scoreResults').doc();
    const now = admin.firestore.FieldValue.serverTimestamp();

    const numericScore = typeof payload.result.score === 'number' ? payload.result.score : null;
    const scoreText =
      typeof payload.result.score === 'string'
        ? payload.result.score
        : payload.result.score == null
          ? null
          : String(payload.result.score);

    const detailEntries = payload.result.details
      ? Object.entries(payload.result.details).map(
          ([key, value]) => `${key}: ${formatDetailValue(value)}`,
        )
      : [];

    await db.runTransaction(async (txn) => {
      if (payload.sessionId) {
        const sessionSnapshot = await txn.get(sessionRef);
        if (!sessionSnapshot.exists) {
          throw new functions.https.HttpsError('not-found', 'Session not found.');
        }
        if (sessionSnapshot.get('userId') !== auth.uid) {
          throw new functions.https.HttpsError('permission-denied', 'Cannot modify this session.');
        }
      }

      const sessionData: Record<string, unknown> = {
        userId: auth.uid,
        templateId: payload.toolId,
        templateSlug: lazySlug,
        templateName: payload.toolName,
        status: 'submitted',
        patientRef: payload.patientRef ?? null,
        inputs: payload.inputs,
        score: numericScore,
        scoreText,
        interpretationLabel: 'Result',
        interpretationSummary: payload.result.interpretation,
        resultDetails: payload.result.details ?? null,
        updatedAt: now,
      };

      if (!payload.sessionId) {
        sessionData.createdAt = now;
      }

      txn.set(sessionRef, sessionData, { merge: true });

      txn.set(resultRef, {
        sessionId: sessionRef.id,
        userId: auth.uid,
        templateId: payload.toolId,
        templateSlug: lazySlug,
        templateName: payload.toolName,
        score: numericScore,
        scoreText,
        interpretationLabel: 'Result',
        interpretationSummary: payload.result.interpretation,
        copyBlocks: detailEntries,
        details: payload.result.details ?? null,
        createdAt: now,
      });
    });

    return {
      sessionId: sessionRef.id,
      resultId: resultRef.id,
    };
  });

export const nightlyScoreAggregation = functions.pubsub
  .topic('score-nightly-aggregations')
  .onPublish(async () => {
    const endDate = new Date();
    endDate.setUTCHours(0, 0, 0, 0);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 1);

    const start = admin.firestore.Timestamp.fromDate(startDate);
    const end = admin.firestore.Timestamp.fromDate(endDate);

    const snapshot = await db
      .collection('scoreResults')
      .where('createdAt', '>=', start)
      .where('createdAt', '<', end)
      .get();

    const aggregates = new Map<
      string,
      {
        templateSlug?: string;
        templateName?: string;
        totalCount: number;
        numericCount: number;
        numericSum: number;
        min: number;
        max: number;
      }
    >();

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const templateId: string = data.templateId;
      const entry = aggregates.get(templateId) ?? {
        templateSlug: data.templateSlug,
        templateName: data.templateName,
        totalCount: 0,
        numericCount: 0,
        numericSum: 0,
        min: Number.POSITIVE_INFINITY,
        max: Number.NEGATIVE_INFINITY,
      };

      entry.totalCount += 1;

      let numericScore: number | null = null;
      if (typeof data.score === 'number' && Number.isFinite(data.score)) {
        numericScore = data.score;
      } else if (typeof data.scoreText === 'string') {
        const parsed = Number(data.scoreText);
        if (!Number.isNaN(parsed)) {
          numericScore = parsed;
        }
      }

      if (numericScore !== null) {
        entry.numericCount += 1;
        entry.numericSum += numericScore;
        entry.min = Math.min(entry.min, numericScore);
        entry.max = Math.max(entry.max, numericScore);
      }

      aggregates.set(templateId, entry);
    });

    const writes = Array.from(aggregates.entries()).map(([templateId, aggregate]) => {
      const periodId = `${templateId}-${start.toDate().toISOString().split('T')[0]}`;
      const averageScore =
        aggregate.numericCount > 0 ? aggregate.numericSum / aggregate.numericCount : null;
      const minScore = aggregate.numericCount > 0 ? aggregate.min : null;
      const maxScore = aggregate.numericCount > 0 ? aggregate.max : null;
      return db.collection('aggregateSnapshots').doc(periodId).set(
        {
          templateId,
          templateSlug: aggregate.templateSlug,
          templateName: aggregate.templateName,
          periodStart: start,
          periodEnd: end,
          count: aggregate.totalCount,
          numericCount: aggregate.numericCount,
          averageScore,
          minScore,
          maxScore,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    });

    await Promise.all(writes);
  });

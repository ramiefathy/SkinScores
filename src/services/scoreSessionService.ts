import { addDoc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { collectionRef, docRef, timestamps } from '../firebase/firestore';
import {
  ScoreResultSchema,
  ScoreSessionSchema,
  type ScoreResult,
  type ScoreSession,
} from '../types/firestore';
import { resolveDate } from '../utils/firestore';

export type ScoreSessionRecord = ScoreSession & {
  id: string;
  scoreText?: string | null;
};

const parseSession = (id: string, data: ScoreSession): ScoreSessionRecord => {
  const parsed = ScoreSessionSchema.parse({
    ...data,
    createdAt: resolveDate((data as Record<string, unknown>).createdAt),
    updatedAt: resolveDate((data as Record<string, unknown>).updatedAt),
  });

  return {
    ...parsed,
    id,
    templateSlug: parsed.templateSlug ?? parsed.templateId,
    templateName: parsed.templateName ?? parsed.templateId,
    score: parsed.score ?? null,
    scoreText: parsed.scoreText ?? null,
    interpretationLabel: parsed.interpretationLabel ?? null,
    interpretationSummary: parsed.interpretationSummary ?? null,
    resultDetails: parsed.resultDetails ?? undefined,
  };
};

const parseResult = (data: ScoreResult) => {
  const parsed = ScoreResultSchema.parse({
    ...data,
    createdAt: resolveDate((data as Record<string, unknown>).createdAt),
  });

  return {
    ...parsed,
    score: parsed.score ?? null,
    scoreText: parsed.scoreText ?? null,
    interpretationLabel: parsed.interpretationLabel ?? null,
    interpretationSummary: parsed.interpretationSummary ?? null,
    copyBlocks: parsed.copyBlocks ?? [],
    details: parsed.details ?? undefined,
  };
};

export const listSessionsForUser = async (userId: string): Promise<ScoreSessionRecord[]> => {
  const sessionsQuery = query(
    collectionRef<ScoreSession>('scoreSessions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(sessionsQuery);
  return snapshot.docs.map((docSnapshot) => parseSession(docSnapshot.id, docSnapshot.data()));
};

export const listSessionsForPatient = async (
  patientId: string,
  userId?: string,
  limitCount = 100,
): Promise<ScoreSessionRecord[]> => {
  const constraints = [
    where('patientRef', '==', patientId),
    orderBy('updatedAt', 'desc'),
    limit(limitCount),
  ];
  const baseQuery = collectionRef<ScoreSession>('scoreSessions');
  const q = userId
    ? query(baseQuery, where('userId', '==', userId), ...constraints)
    : query(baseQuery, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnapshot) => parseSession(docSnapshot.id, docSnapshot.data()));
};

export const createSession = async (session: ScoreSession) => {
  ScoreSessionSchema.parse(session);
  await addDoc(collectionRef<ScoreSession>('scoreSessions'), {
    ...session,
    ...timestamps(),
  });
};

export const updateSession = async (sessionId: string, updates: Partial<ScoreSession>) => {
  if (Object.keys(updates).length === 0) return;
  const ref = docRef<ScoreSession>('scoreSessions', sessionId);
  await updateDoc(ref, { ...updates, updatedAt: timestamps().updatedAt });
};

export const fetchResultBySession = async (sessionId: string) => {
  const resultsQuery = query(
    collectionRef<ScoreResult>('scoreResults'),
    where('sessionId', '==', sessionId),
    limit(1),
  );
  const snapshot = await getDocs(resultsQuery);
  if (snapshot.empty) return null;
  return parseResult(snapshot.docs[0].data());
};

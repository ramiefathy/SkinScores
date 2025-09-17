import { getDocs, orderBy, query, where, limit } from 'firebase/firestore';
import { collectionRef } from '../firebase/firestore';
import { resolveDate } from '../utils/firestore';

export type AggregateSnapshot = {
  id: string;
  templateId: string;
  templateSlug?: string;
  templateName?: string;
  periodStart: Date;
  periodEnd: Date;
  count: number;
  numericCount?: number;
  averageScore: number | null;
  minScore: number | null;
  maxScore: number | null;
  updatedAt: Date;
};

const parseAggregate = (id: string, data: Record<string, unknown>): AggregateSnapshot => ({
  id,
  templateId: String(data.templateId ?? ''),
  templateSlug: data.templateSlug ? String(data.templateSlug) : undefined,
  templateName: data.templateName ? String(data.templateName) : undefined,
  periodStart: resolveDate(data.periodStart),
  periodEnd: resolveDate(data.periodEnd),
  count: Number(data.count ?? 0),
  numericCount:
    data.numericCount === undefined || data.numericCount === null
      ? undefined
      : Number(data.numericCount),
  averageScore:
    data.averageScore === null || data.averageScore === undefined
      ? null
      : Number(data.averageScore),
  minScore: data.minScore === null || data.minScore === undefined ? null : Number(data.minScore),
  maxScore: data.maxScore === null || data.maxScore === undefined ? null : Number(data.maxScore),
  updatedAt: data.updatedAt ? resolveDate(data.updatedAt) : new Date(),
});

export const listRecentAggregates = async (templateId?: string, days = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const baseQuery = collectionRef<Record<string, unknown>>('aggregateSnapshots');
  const constraints = [orderBy('periodStart', 'desc'), limit(200)];
  if (templateId) {
    // We'll add where filter at fetch time
  }

  const q = templateId
    ? query(baseQuery, where('templateId', '==', templateId), ...constraints)
    : query(baseQuery, where('periodStart', '>=', since), ...constraints);

  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((docSnapshot) => parseAggregate(docSnapshot.id, docSnapshot.data()))
    .filter((aggregate) => aggregate.periodStart.getTime() >= since.getTime());
};

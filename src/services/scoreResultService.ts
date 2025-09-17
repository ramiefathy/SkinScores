import { getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { collectionRef } from '../firebase/firestore';
import { ScoreResultSchema, type ScoreResult } from '../types/firestore';
import { resolveDate } from '../utils/firestore';

type ScoreResultRecord = ScoreResult & { id: string; scoreText?: string | null };

const parseResult = (id: string, data: ScoreResult): ScoreResultRecord => {
  const parsed = ScoreResultSchema.parse({
    ...data,
    createdAt: resolveDate((data as Record<string, unknown>).createdAt),
  });

  return {
    ...parsed,
    id,
    score: parsed.score ?? null,
    scoreText: parsed.scoreText ?? null,
    interpretationLabel: parsed.interpretationLabel ?? null,
    interpretationSummary: parsed.interpretationSummary ?? null,
    copyBlocks: parsed.copyBlocks ?? [],
    details: parsed.details ?? undefined,
  };
};

export const listResultsForSessions = async (
  sessionIds: string[],
  max = 50,
): Promise<ScoreResultRecord[]> => {
  if (sessionIds.length === 0) return [];
  const results: ScoreResultRecord[] = [];
  const chunks: string[][] = [];
  for (let i = 0; i < sessionIds.length; i += 10) {
    chunks.push(sessionIds.slice(i, i + 10));
  }
  for (const chunk of chunks) {
    const snapshot = await getDocs(
      query(
        collectionRef<ScoreResult>('scoreResults'),
        where('sessionId', 'in', chunk),
        orderBy('createdAt', 'desc'),
        limit(max),
      ),
    );
    snapshot.docs.forEach((docSnapshot) => {
      results.push(parseResult(docSnapshot.id, docSnapshot.data()));
    });
  }
  results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return results;
};

export const listResultsForUser = async (userId: string, max = 100) => {
  const snapshot = await getDocs(
    query(
      collectionRef<ScoreResult>('scoreResults'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(max),
    ),
  );
  return snapshot.docs.map((docSnapshot) => parseResult(docSnapshot.id, docSnapshot.data()));
};

export type { ScoreResultRecord };

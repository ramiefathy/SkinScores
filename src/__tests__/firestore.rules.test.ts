import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';

const projectId = 'skinscores-test';
const rules = readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8');

let testEnv: Awaited<ReturnType<typeof initializeTestEnvironment>>;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await seedData();
});

const seedData = async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'scoreSessions', 'session-1'), {
      userId: 'clinician-1',
      templateId: 'template-1',
      templateSlug: 'weighted-example',
      templateName: 'Weighted Example',
      status: 'submitted',
      patientRef: null,
      inputs: {},
      score: 20,
      interpretationLabel: 'Normal',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await setDoc(doc(db, 'scoreResults', 'result-1'), {
      sessionId: 'session-1',
      userId: 'clinician-1',
      templateId: 'template-1',
      score: 20,
      interpretationLabel: 'Normal',
      interpretationSummary: 'All good',
      copyBlocks: ['Score: 20'],
      createdAt: new Date(),
    });
  });
};

describe('Firestore security rules', () => {
  it('prevents clinicians from accessing other users sessions', async () => {
    const clinician = testEnv.authenticatedContext('clinician-2', { role: 'clinician' });
    const db = clinician.firestore();
    await assertFails(getDoc(doc(db, 'scoreSessions/session-1')));
  });

  it('allows clinicians to access their own sessions', async () => {
    const clinician = testEnv.authenticatedContext('clinician-1', { role: 'clinician' });
    const db = clinician.firestore();
    await assertSucceeds(getDoc(doc(db, 'scoreSessions/session-1')));
  });

  it('allows admins to list score results', async () => {
    const admin = testEnv.authenticatedContext('admin-1', { role: 'admin' });
    const db = admin.firestore();
    const resultsQuery = query(
      collection(db, 'scoreResults'),
      where('userId', '==', 'clinician-1'),
    );
    await assertSucceeds(getDocs(resultsQuery));
  });
});

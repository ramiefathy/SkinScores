/**
 * Emulator seeding script.
 * Usage: node --loader ts-node/esm src/seed/emulator.mts --project=skinscores-test
 */

import admin from 'firebase-admin';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
const projectId = args.project ?? process.env.GOOGLE_CLOUD_PROJECT ?? 'skinscores-test';

if (!projectId) {
  throw new Error('Project ID required. Pass --project or set GOOGLE_CLOUD_PROJECT');
}

process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST =
  process.env.FIREBASE_AUTH_EMULATOR_HOST ?? '127.0.0.1:9099';

admin.initializeApp({ projectId });
const auth = admin.auth();

async function seedUser() {
  const email = 'test-e2e@example.com';
  const password = 'TestPassword123!';
  try {
    const user = await auth.createUser({ email, password });
    await auth.setCustomUserClaims(user.uid, { role: 'clinician' });
    console.log(`Seeded user ${email}`);
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError?.code === 'auth/email-already-exists') {
      const user = await auth.getUserByEmail(email);
      await auth.setCustomUserClaims(user.uid, { role: 'clinician' });
      console.log('Seed user already exists; claims refreshed.');
    } else {
      throw error;
    }
  }
}

async function main() {
  await seedUser();
  console.log('Emulator seed complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

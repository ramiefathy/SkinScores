#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const projectId = args.project || process.env.GOOGLE_CLOUD_PROJECT || 'skinscores-test';
if (!projectId) {
  throw new Error('Project ID required.');
}

process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST =
  process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';

if (!admin.apps.length) {
  admin.initializeApp({ projectId });
}
const firestore = admin.firestore();
const auth = admin.auth();

const templatesPath = path.resolve(__dirname, 'data', 'score-templates.json');
const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));

async function seedTemplates() {
  for (const template of templates) {
    const docId = `${template.slug}-v${template.version}`;
    await firestore.doc(`scoreTemplates/${docId}`).set({
      ...template,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

async function seedUser() {
  const email = 'test-e2e@example.com';
  const password = 'TestPassword123!';
  try {
    const user = await auth.createUser({ email, password });
    await auth.setCustomUserClaims(user.uid, { role: 'clinician' });
    console.log(`Seeded user ${email}`);
  } catch (error) {
    if (error?.code === 'auth/email-already-exists') {
      const user = await auth.getUserByEmail(email);
      await auth.setCustomUserClaims(user.uid, { role: 'clinician' });
      console.log('Seed user already exists; claims refreshed.');
    } else {
      throw error;
    }
  }
}

async function main() {
  await seedTemplates();
  await seedUser();
  console.log('Emulator seed complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

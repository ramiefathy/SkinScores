#!/usr/bin/env node
import admin from 'firebase-admin';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
const projectId = args.project ?? process.env.GOOGLE_CLOUD_PROJECT;

if (!projectId) {
  console.error('Project ID required. Pass --project or set GOOGLE_CLOUD_PROJECT.');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({ projectId });
}

const firestore = admin.firestore();

async function clearAggregateSnapshots() {
  console.log(`Deleting documents from aggregateSnapshots for project ${projectId}...`);
  const snapshot = await firestore.collection('aggregateSnapshots').get();
  if (snapshot.empty) {
    console.log('No aggregateSnapshots documents to delete.');
    return;
  }

  const batches = [];
  let batch = firestore.batch();
  let counter = 0;

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
    counter += 1;
    if (counter === 450) {
      batches.push(batch.commit());
      batch = firestore.batch();
      counter = 0;
    }
  });

  if (counter > 0) {
    batches.push(batch.commit());
  }

  await Promise.all(batches);
  console.log('aggregateSnapshots cleared.');
}

clearAggregateSnapshots()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to clear aggregateSnapshots:', error);
    process.exit(1);
  });

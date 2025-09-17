import { describe } from 'vitest';

// Integration tests for callable Cloud Functions are pending. During this session,
// the Functions emulator did not reliably observe Firestore documents seeded via
// the Admin SDK. Once emulator bridging is resolved (likely by running
// firebase-tools >= v13 with shared emulator hub configuration), re-enable tests
// that exercise calculateScore and generateResultExport end-to-end.

describe.skip('calculateScore + generateResultExport (emulator)', () => {
  // Implementation tracked in TASK-INT-FUNCTIONS.
});

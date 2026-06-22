/**
 * Firestore security rules tests — run with the Firebase Emulator.
 * Start emulator: npx firebase emulators:start --only firestore,auth
 * Run tests:      npx jest test/firestore.test.js
 */
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, updateDoc, deleteDoc } = require('firebase/firestore');
const fs = require('fs');

const PROJECT_ID = 'pick-your-plate-test';
const RULES_PATH = 'firestore.rules';

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(RULES_PATH, 'utf8'),
      port: 8080,
      host: 'localhost',
    },
  });
});

afterAll(async () => { await testEnv.cleanup(); });
beforeEach(async () => { await testEnv.clearFirestore(); });

// Seed helper — uses Admin context so rules don't interfere
async function seed(data) {
  await testEnv.withSecurityRulesDisabled(async ctx => {
    const db = ctx.firestore();
    for (const [path, value] of Object.entries(data)) {
      const parts = path.split('/');
      await setDoc(doc(db, parts[0], parts[1]), value);
    }
  });
}

// 1. Same-family uid can read session data
test('same-family uid can read session', async () => {
  const fid = 'FAMIL1';
  const uid = 'user-caregiver';
  await seed({
    [`families/${fid}`]: { members: { [uid]: 'caregiver' } },
    [`sessions/${fid}`]: { status: 'idle' },
  });
  const ctx = testEnv.authenticatedContext(uid);
  await assertSucceeds(getDoc(doc(ctx.firestore(), 'sessions', fid)));
});

// 2. Same-family uid can write session data
test('same-family uid can write session', async () => {
  const fid = 'FAMIL2';
  const uid = 'user-caregiver';
  await seed({ [`families/${fid}`]: { members: { [uid]: 'caregiver' } } });
  const ctx = testEnv.authenticatedContext(uid);
  await assertSucceeds(setDoc(doc(ctx.firestore(), 'sessions', fid), { status: 'pending' }));
});

// 3. Different uid cannot read another family's session
test('cross-family uid is denied', async () => {
  const fid = 'FAMIL3';
  await seed({
    [`families/${fid}`]: { members: { 'user-owner': 'caregiver' } },
    [`sessions/${fid}`]: { status: 'idle' },
  });
  const ctx = testEnv.authenticatedContext('user-stranger');
  await assertFails(getDoc(doc(ctx.firestore(), 'sessions', fid)));
});

// 4. Unauthenticated request is denied
test('unauthenticated request is denied', async () => {
  const fid = 'FAMIL4';
  await seed({ [`sessions/${fid}`]: { status: 'idle' } });
  const ctx = testEnv.unauthenticatedContext();
  await assertFails(getDoc(doc(ctx.firestore(), 'sessions', fid)));
});

// 5. Client cannot self-add to a family (must go through /api/join-family)
test('client cannot self-join a family', async () => {
  const fid = 'FAMIL5';
  const ownerUid = 'user-owner';
  const intruderUid = 'user-intruder';
  await seed({ [`families/${fid}`]: { members: { [ownerUid]: 'caregiver' } } });
  const ctx = testEnv.authenticatedContext(intruderUid);
  await assertFails(
    updateDoc(doc(ctx.firestore(), 'families', fid), { [`members.${intruderUid}`]: 'child' })
  );
});

const crypto = require('crypto');
const admin = require('./admin');

// 32-char alphabet — omits 0/O and 1/I to avoid transcription errors
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LEN = 6;
// 256 is evenly divisible by 32, so b % 32 has no modular bias
const genCode = () => Array.from(crypto.randomBytes(CODE_LEN), b => CHARS[b % CHARS.length]).join('');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  let uid;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const db = admin.firestore();

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = genCode();
    try {
      await db.runTransaction(async t => {
        const sessionRef = db.collection('sessions').doc(code);
        const familyRef  = db.collection('families').doc(code);
        const snap = await t.get(sessionRef);
        if (snap.exists) throw Object.assign(new Error('collision'), { isCollision: true });
        const now = new Date();
        t.set(sessionRef, { status: 'idle', createdAt: now, deleteAt: new Date(Date.now() + 86400000) });
        t.set(familyRef,  { members: { [uid]: 'caregiver' }, createdAt: now });
      });
      return res.status(200).json({ code });
    } catch (e) {
      if (e.isCollision) continue;
      return res.status(500).json({ error: e.message });
    }
  }
  return res.status(500).json({ error: 'Could not allocate unique code' });
};

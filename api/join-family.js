const admin = require('./admin');

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

  const { code } = req.body || {};
  if (!code || typeof code !== 'string' || !/^[A-Z0-9]{6}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid family code' });
  }

  const db = admin.firestore();
  const familySnap = await db.collection('families').doc(code).get();
  if (!familySnap.exists) return res.status(404).json({ error: 'Family not found' });

  await db.collection('families').doc(code).update({ [`members.${uid}`]: 'child' });
  return res.status(200).json({ ok: true });
};

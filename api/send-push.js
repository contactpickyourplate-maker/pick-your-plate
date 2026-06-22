const webpush = require('web-push');
const admin = require('./admin');

// Best-effort in-memory rate limit (resets per cold start; good enough for a prototype)
const _rl = new Map();
function isRateLimited(uid) {
  const now = Date.now();
  const e = _rl.get(uid) || { n: 0, reset: now + 60000 };
  if (now > e.reset) { e.n = 0; e.reset = now + 60000; }
  e.n++;
  _rl.set(uid, e);
  return e.n > 10;
}

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

  if (isRateLimited(uid)) return res.status(429).json({ error: 'Rate limit exceeded' });

  const { subscription, payload, familyCode } = req.body || {};
  if (!subscription?.endpoint || !familyCode) {
    return res.status(400).json({ error: 'Missing subscription or familyCode' });
  }

  // Authorize: caller must be a member of the family
  const familySnap = await admin.firestore().collection('families').doc(familyCode).get();
  if (!familySnap.exists || !(uid in (familySnap.data().members || {}))) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const pub  = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return res.status(500).json({ error: 'VAPID keys not configured' });

  webpush.setVapidDetails('mailto:elplacebo@gmail.com', pub, priv);

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload || {
      title: 'Pick Your Plate',
      body: "Your menu is ready — go pick your plate!",
    }));
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ error: e.message });
  }
};

const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || 'null');
  if (!serviceAccount) throw new Error('FIREBASE_SERVICE_ACCOUNT env var is not set');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

module.exports = admin;

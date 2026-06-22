module.exports = function handler(req, res) {
  res.status(410).json({ error: 'Endpoint removed — sync now runs through Firestore.' });
};

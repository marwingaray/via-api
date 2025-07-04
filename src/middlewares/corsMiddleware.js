app.use((err, req, res, next) => {
  if (err.message === 'No autorizado por CORS') {
    return res.status(403).json({ error: 'CORS denegado', code: 'CORS_DENIED' });
  }
  next(err);
});
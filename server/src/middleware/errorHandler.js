export const errorHandler = (err, req, res, next) => {
  console.error('[API ERROR]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected server error occurred.',
    timestamp: new Date().toISOString()
  });
};

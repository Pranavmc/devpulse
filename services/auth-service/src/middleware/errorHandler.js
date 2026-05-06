function errorHandler(err, req, res, _next) {
  console.error(`[auth-service] Error: ${err.message}`);
  console.error(err.stack);

  const status = err.statusCode || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  return res.status(status).json({ error: message });
}

module.exports = errorHandler;

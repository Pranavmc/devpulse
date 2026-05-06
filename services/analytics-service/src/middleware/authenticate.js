const axios = require('axios');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/me`,
      {
        headers: { Authorization: authHeader },
        timeout: 5000,
      }
    );

    req.user = response.data.user;
    next();
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.error(`[analytics-service] Auth service error: ${err.message}`);
    return res.status(503).json({ error: 'Authentication service unavailable' });
  }
}

module.exports = authenticate;

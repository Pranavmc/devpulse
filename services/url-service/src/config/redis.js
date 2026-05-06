const Redis = require('ioredis');

let redis = null;

function getRedisClient() {
  if (redis) return redis;

  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 5) {
        console.error('[url-service] Redis: max reconnect attempts reached');
        return null; // stop retrying
      }
      const delay = Math.min(times * 500, 3000);
      console.log(`[url-service] Redis reconnecting in ${delay}ms (attempt ${times})`);
      return delay;
    },
    lazyConnect: false,
  });

  redis.on('connect', () => console.log('[url-service] Redis connected'));
  redis.on('error', (err) => console.error(`[url-service] Redis error: ${err.message}`));

  return redis;
}

module.exports = { getRedisClient };

const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const { getRedisClient } = require('../config/redis');
const { publishClickEvent } = require('../config/kafka');

const CACHE_TTL = 3600; // 1 hour

async function createUrl(req, res, next) {
  try {
    const { originalUrl, title } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'originalUrl is required' });
    }

    const shortCode = nanoid(8);

    const url = await Url.create({
      shortCode,
      originalUrl,
      userId: req.user.id,
      title: title || null,
    });

    // Cache in Redis immediately
    try {
      const redis = getRedisClient();
      await redis.set(shortCode, originalUrl, 'EX', CACHE_TTL);
    } catch (err) {
      console.error(`[url-service] Redis cache-on-create failed: ${err.message}`);
    }

    const shortUrl = `${process.env.BASE_URL}/r/${shortCode}`;

    return res.status(201).json({
      shortCode: url.shortCode,
      shortUrl,
      originalUrl: url.originalUrl,
    });
  } catch (err) {
    next(err);
  }
}

async function listUrls(req, res, next) {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(urls);
  } catch (err) {
    next(err);
  }
}

async function deleteUrl(req, res, next) {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOneAndDelete({
      shortCode,
      userId: req.user.id,
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Remove from Redis
    try {
      const redis = getRedisClient();
      await redis.del(shortCode);
    } catch (err) {
      console.error(`[url-service] Redis cache-delete failed: ${err.message}`);
    }

    return res.json({ message: 'deleted' });
  } catch (err) {
    next(err);
  }
}

async function redirect(req, res, next) {
  try {
    const { shortCode } = req.params;

    // 1. Check Redis cache first
    let originalUrl = null;
    try {
      const redis = getRedisClient();
      originalUrl = await redis.get(shortCode);
    } catch (err) {
      console.error(`[url-service] Redis read failed, falling back to MongoDB: ${err.message}`);
    }

    // 2. Cache miss — query MongoDB
    if (!originalUrl) {
      const urlDoc = await Url.findOne({ shortCode, isActive: true });

      if (!urlDoc) {
        return res.status(404).json({ error: 'Short URL not found' });
      }

      // Check expiry
      if (urlDoc.expiresAt && urlDoc.expiresAt < new Date()) {
        return res.status(410).json({ error: 'Short URL has expired' });
      }

      originalUrl = urlDoc.originalUrl;

      // Store in Redis for next time
      try {
        const redis = getRedisClient();
        await redis.set(shortCode, originalUrl, 'EX', CACHE_TTL);
      } catch (err) {
        console.error(`[url-service] Redis cache-set failed: ${err.message}`);
      }
    }

    // 3. Increment click count (async, non-blocking)
    Url.updateOne({ shortCode }, { $inc: { clickCount: 1 } }).catch((err) =>
      console.error(`[url-service] Click count increment failed: ${err.message}`)
    );

    // 4. Publish click event to Kafka (non-blocking)
    const clickEvent = {
      shortCode,
      userId: 'anonymous',
      originalUrl,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent') || '',
    };

    publishClickEvent(clickEvent).catch((err) =>
      console.error(`[url-service] Kafka publish failed: ${err.message}`)
    );

    // 5. Redirect
    return res.redirect(301, originalUrl);
  } catch (err) {
    next(err);
  }
}

module.exports = { createUrl, listUrls, deleteUrl, redirect };

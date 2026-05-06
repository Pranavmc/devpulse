const { pool } = require('../config/db');

class ClickEvent {
  static async insert({ shortCode, userId, originalUrl, ipAddress, userAgent, clickedAt }) {
    const result = await pool.query(
      `INSERT INTO click_events (short_code, user_id, original_url, ip_address, user_agent, clicked_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [shortCode, userId, originalUrl, ipAddress, userAgent, clickedAt || new Date()]
    );
    return result.rows[0];
  }

  static async getSummary(shortCode) {
    const result = await pool.query(
      `SELECT
         $1 AS short_code,
         COUNT(*)::int AS total_clicks,
         COUNT(DISTINCT ip_address)::int AS unique_ips,
         MIN(clicked_at) AS first_click,
         MAX(clicked_at) AS last_click
       FROM click_events
       WHERE short_code = $1`,
      [shortCode]
    );
    return result.rows[0];
  }

  static async getTimeline(shortCode) {
    const result = await pool.query(
      `SELECT
         DATE(clicked_at) AS date,
         COUNT(*)::int AS clicks
       FROM click_events
       WHERE short_code = $1
         AND clicked_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(clicked_at)
       ORDER BY date`,
      [shortCode]
    );
    return result.rows;
  }

  static async getDashboard() {
    const totalClicks = await pool.query(
      'SELECT COUNT(*)::int AS total_clicks FROM click_events'
    );
    const totalUrls = await pool.query(
      'SELECT COUNT(DISTINCT short_code)::int AS total_urls FROM click_events'
    );
    const topUrls = await pool.query(
      `SELECT short_code, COUNT(*)::int AS clicks
       FROM click_events
       GROUP BY short_code
       ORDER BY clicks DESC
       LIMIT 10`
    );

    return {
      totalUrls: totalUrls.rows[0].total_urls,
      totalClicks: totalClicks.rows[0].total_clicks,
      topUrls: topUrls.rows.map((r) => ({
        shortCode: r.short_code,
        clicks: r.clicks,
      })),
    };
  }
}

module.exports = ClickEvent;

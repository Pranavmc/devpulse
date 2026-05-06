const ClickEvent = require('../models/ClickEvent');

async function getSummary(req, res, next) {
  try {
    const { shortCode } = req.params;
    const summary = await ClickEvent.getSummary(shortCode);

    return res.json({
      shortCode,
      totalClicks: summary.total_clicks,
      uniqueIps: summary.unique_ips,
      firstClick: summary.first_click,
      lastClick: summary.last_click,
    });
  } catch (err) {
    next(err);
  }
}

async function getTimeline(req, res, next) {
  try {
    const { shortCode } = req.params;
    const timeline = await ClickEvent.getTimeline(shortCode);

    return res.json(
      timeline.map((row) => ({
        date: row.date,
        clicks: row.clicks,
      }))
    );
  } catch (err) {
    next(err);
  }
}

async function getDashboard(req, res, next) {
  try {
    const dashboard = await ClickEvent.getDashboard();
    return res.json(dashboard);
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary, getTimeline, getDashboard };

const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

async function connectMongo() {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('[url-service] MongoDB connected');
      return;
    } catch (err) {
      retries++;
      console.error(
        `[url-service] MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${err.message}`
      );
      if (retries >= MAX_RETRIES) {
        throw new Error('[url-service] Could not connect to MongoDB after max retries');
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

module.exports = { connectMongo };

const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const router = express.Router();
const DATA_PATH = path.join(__dirname, "../../../data/items.json");

// Cache state
let cache = {
  stats: null,
  lastModified: null,
  lastCheck: 0,
};

// Cache TTL in milliseconds (5 seconds)
const CACHE_TTL = 5000;

// Ensure data directory and file exist
async function ensureDataFile() {
  const dataDir = path.dirname(DATA_PATH);

  try {
    await fs.access(dataDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(DATA_PATH);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(DATA_PATH, JSON.stringify([]), "utf8");
  }
}

// Initialize data file on server start
ensureDataFile().catch(console.error);

// Calculate stats - keep it simple and efficient
function computeStats(items) {
  if (items.length === 0) {
    return {
      total: 0,
      averagePrice: 0,
      maxPrice: 0,
      minPrice: 0,
    };
  }

  let totalPrice = 0;
  let maxPrice = items[0].price;
  let minPrice = items[0].price;

  for (const item of items) {
    totalPrice += item.price;
    if (item.price > maxPrice) maxPrice = item.price;
    if (item.price < minPrice) minPrice = item.price;
  }

  return {
    total: items.length,
    averagePrice: totalPrice / items.length,
  };
}

// Check if file has been modified since last cache
async function hasFileChanged() {
  try {
    const stats = await fs.stat(DATA_PATH);
    return stats.mtimeMs !== cache.lastModified;
  } catch (error) {
    // If we can't check the file, assume it changed to be safe
    return true;
  }
}

// Check if cache is stale
function isCacheStale() {
  return !cache.stats || Date.now() - cache.lastCheck > CACHE_TTL;
}

// Get stats with caching
router.get("/", async (req, res, next) => {
  try {
    // Ensure file exists before proceeding
    await ensureDataFile();

    const shouldInvalidate = await hasFileChanged();
    const isStale = isCacheStale();

    if (!cache.stats || shouldInvalidate || isStale) {
      // Cache miss or invalid - recalculate
      const rawData = await fs.readFile(DATA_PATH, "utf8");
      const items = JSON.parse(rawData);

      const stats = computeStats(items); // ← FIX: Remove await here
      const fileStats = await fs.stat(DATA_PATH);

      cache = {
        stats,
        lastModified: fileStats.mtimeMs,
        lastCheck: Date.now(),
      };
    }

    res.json(cache.stats);
  } catch (error) {
    console.error("Error in stats endpoint:", error.message);
    res.status(500).json({
      error: "Failed to retrieve statistics",
      message: error.message,
    });
  }
});

// Clear cache endpoint for maintenance
router.post("/clear-cache", (req, res) => {
  cache = {
    stats: null,
    lastModified: null,
    lastCheck: 0,
  };
  res.status(200).json({ status: "cache cleared" });
});

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    await fs.access(DATA_PATH);
    res.json({
      status: "healthy",
      dataFileExists: true,
      cacheStatus: cache.stats ? "cached" : "empty",
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      dataFileExists: false,
      error: error.message,
    });
  }
});

module.exports = router;

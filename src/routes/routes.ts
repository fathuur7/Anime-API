import aniwatch_router from "./aniwatch/routes";
import gogoanime_router from "./gogoanime/routes";
import { getRoot } from "../lib/getRoot";
import { Router, type IRouter } from "express";
import axios from "axios";

const router: IRouter = Router();

// /
router.get("/", getRoot);

// health check API
router.get("/health", (_req, res) => {
  res.sendStatus(200);
});

router.get("/anime/episode-srcs", async (req, res) => {
  try {
    // Forward the query parameters
    const response = await axios.get("https://anime-api-web.vercel.app/aniwatch/episode-srcs", {
      params: req.query,
      timeout: 10000, // Set timeout to handle slow responses
    });
    
    // Return the data from the API
    res.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error proxying request:", error.message);
    } else {
      console.error("Error proxying request:", error);
    }
    const err = error as any; // Explicitly cast error to any
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data || "Internal server error"
    });
  }
});

// aniwatch, hianime, zoro
router.use("/aniwatch", aniwatch_router);
router.use("/hianime", aniwatch_router);
router.use("/zoro", aniwatch_router);

// gogoanime, anitaku
router.use("/gogoanime", gogoanime_router);
router.use("/anitaku", gogoanime_router);

export { router };

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

router.get("/aniwatch/episode-srcs", async (req, res) => {
  try {
    // Get all query parameters from the request
    const params = req.query;
    console.log("Proxying request with params:", params);
    
    // Forward the request to the target API
    const response = await axios.get("https://anime-api-web.vercel.app/aniwatch/episode-srcs", {
      params,
      timeout: 15000, // Set a longer timeout for slow responses
      headers: {
        // Forward some headers from the original request if needed
        'Accept': 'application/json',
        'User-Agent': req.headers['user-agent']
      }
    });
    
    // Return the response from the API
    res.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error proxying request:", error.message);
    } else {
      console.error("Error proxying request:", error);
    }
    
    // Forward the error status code if available
    const statusCode = axios.isAxiosError(error) && error.response?.status ? error.response.status : 500;
    res.status(statusCode).json({
      error: error instanceof Error ? error.message : "Unknown error",
      details: axios.isAxiosError(error) && error.response?.data ? error.response.data : "Internal server error"
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

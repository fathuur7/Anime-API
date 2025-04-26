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
  // Check if we're already proxying this request
  const isProxyRequest = req.get('X-Is-Proxy');
  
  if (isProxyRequest) {
    return res.status(508).json({
      error: {
        code: "508",
        message: "Infinite loop detected"
      }
    });
  }
  
  try {
    const params = req.query;
    console.log("Proxying request with params:", params);
    
    const response = await axios.get("https://anime-api-web.vercel.app/aniwatch/episode-srcs", {
      params,
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': req.headers['user-agent'],
        'X-Is-Proxy': 'true' // Mark this request as a proxy request
      }
    });
    
    res.json(response.data);
  } catch (error) {
    // Error handling remains the same
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

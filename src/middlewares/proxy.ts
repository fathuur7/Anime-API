import axios from "axios";

export const Proxy = async (req: { query: { url: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; setHeader: (arg0: string, arg1: string) => void; }) => {
    const videoUrl = req.query.url as string;
    if (!videoUrl) return res.status(400).send("No URL provided");
  
    try {
      const response = await axios.get(videoUrl, {
        responseType: "stream",
      });
  
      // Atur headers supaya bisa dimainkan di frontend
      res.setHeader("Content-Type", response.headers["content-type"] || "application/vnd.apple.mpegurl");
      res.setHeader("Access-Control-Allow-Origin", "*");
      response.data.pipe(res);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Proxy error:", err.message);
      } else {
        console.error("Proxy error:", err);
      }
      res.status(500).send("Failed to fetch stream");
    }
  }
  
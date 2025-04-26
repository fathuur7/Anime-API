import express from "express";
import { config } from "dotenv";
// import { limiter } from "./middlewares/rateLimit";
import Cors from "cors";
import { router } from "./routes/routes";

config(); // dotenv

const app = express();

// Langsung pakai fungsinya
app.use(Cors({
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  preflightContinue: false,
  maxAge: 3600,
  credentials: true,
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


const PORT = process.env.PORT
console.log(PORT)

//middlewares
// app.use(limiter);/

// router
app.use("/", router);



app.listen(PORT, () => {
  console.log(`⚔️  API started ON PORT : ${PORT} @ STARTED  ⚔️`);
});

export default app;

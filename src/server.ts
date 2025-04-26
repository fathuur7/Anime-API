import express from "express";
import { config } from "dotenv";
// import { limiter } from "./middlewares/rateLimit";
import Cors from "cors";
import { router } from "./routes/routes";

config(); // dotenv

const app = express();

// Langsung pakai fungsinya
app.use(Cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['your-production-domain.com'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true
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

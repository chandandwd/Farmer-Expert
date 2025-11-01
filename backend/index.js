// ==============================
// 🌾 CropXpert Backend Server
// ==============================

import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
//import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { initDB } from "./db.js";
//const db = await initDB();


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ==============================
// 🛡️ Middleware
// ==============================
app.use(cors({
  origin: "http://localhost:3001", // Frontend URL
  methods: ["GET", "POST"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// 📂 File Uploads (for image upload)
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
    cb(null, "uploads/");
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ==============================
// 🧩 MySQL Database Connection
// ==============================
const db = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "cropxpert",
});

// ==============================
// 🌱 Routes
// ==============================

app.get("/", (req, res) => {
  res.send("🌾 CropXpert backend running successfully!");
});

// 📸 Upload Image
app.post("/api/upload-image", upload.single("file"), (req, res) => {
  const diseases = ["Leaf Blight", "Rust", "Healthy", "Bacterial Spot"];
  const detected = diseases[Math.floor(Math.random() * diseases.length)];
  const confidence = (Math.random() * 0.3 + 0.7).toFixed(2);

  res.json({ disease: detected, confidence: parseFloat(confidence) });
});

// 🌦 Get Weather Data
app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: "Missing OpenWeather API key" });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = response.data;
    res.json({
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch weather data" });
  }
});

// 💹 Market Prices
app.get("/api/market-prices", async (req, res) => {
  const { crop } = req.query;
  const prices = {
    wheat: 2200,
    rice: 2400,
    maize: 1800,
    cotton: 6000,
  };
  res.json({
    crop,
    price_per_quintal: prices[crop?.toLowerCase()] || "Data not available",
  });
});

// 💰 Profit Estimation (used by frontend)
app.post("/api/profit-estimate", async (req, res) => {
  try {
    const { crop, yield_kg, disease_confidence, price_per_kg } = req.body;

    const loss_factor = disease_confidence * 0.3;
    const healthy_yield = yield_kg * (1 - loss_factor);
    const profit = healthy_yield * price_per_kg;
    const loss_percentage = (loss_factor * 100).toFixed(2);

    // Save result to MySQL
    await db.execute(
      "INSERT INTO crops (crop_name, disease, confidence, yield_kg, price_per_kg, profit, loss_percentage) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [crop, "Detected Disease", disease_confidence, yield_kg, price_per_kg, profit, loss_percentage]
    );

    res.json({
      estimated_profit: parseFloat(profit.toFixed(2)),
      expected_yield_after_loss: parseFloat(healthy_yield.toFixed(2)),
      loss_percentage: parseFloat(loss_percentage),
    });
  } catch (error) {
    console.error("Error in profit estimation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==============================
// 🚀 Start Server
// ==============================
app.listen(PORT, () =>
  console.log(`✅ CropXpert backend running at http://localhost:${PORT}`)
);



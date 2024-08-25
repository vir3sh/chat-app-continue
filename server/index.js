import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import jwt from "jsonwebtoken";

dotenv.config();

// Constants and configurations
const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;
const SECRET_KEY = process.env.SECRET_KEY || 'your_default_secret_key';

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Ensure this matches your front-end URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// JWT Utility Functions
export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Start server and connect to database
mongoose.connect(databaseURL)

  .then(() => {
    console.log("DB connection successful");

    // Start server after DB connection is successful
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("DB connection error:", err.message);
  });

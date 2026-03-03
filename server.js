const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");
// Load environment variables
require("dotenv").config();

// Initialize app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require("./routes/auth");

// Use routes
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Test Route
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data accessed",
    userId: req.user.id
  });
});

// Global Error Handler (optional but professional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong"
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
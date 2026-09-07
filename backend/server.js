const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");

const app = express();


// Middleware

app.use(cors());
app.use(express.json());


// Database

connectDB();


// Test route

app.get("/", (req, res) => {

  res.send("NexaCart API is running...");

});


// Routes

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);


// Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});

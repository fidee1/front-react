require("dotenv").config();
const express = require("express");

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const cors = require("cors");
app.use(
  cors({
    origin: "*", // Autorise toutes les origines
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

// Connexion DB + Démarrage Serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n=== SERVEUR DÉMARRÉ SUR PORT ${PORT} ===`);
  });
});

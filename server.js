import express from "express";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON,pass the HTML form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", authRoutes);

//Use EJS for views
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Test route
app.get("/", (req, res) => {
  res.redirect("/login");
});
app.get("/register", (req, res) => {
  res.render("register", { error: null });
});
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

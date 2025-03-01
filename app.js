import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import authroutes from "./src/routes/auth.js";
import taskroutes from "./src/routes/tasks.js";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = process.env.VITE_PORT || 5000;

app.use("/auth", authroutes);
app.use("/task", taskroutes);

app.listen(port, () => {
  console.log("Server is running on http://localhost:5000");
});

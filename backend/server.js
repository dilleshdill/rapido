import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/", userRoutes);
app.use("/upload", uploadRoutes);

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);

const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoute.js");


const app = express();

app.use(cors({ origin: "http://localhost:5173" })); // allow frontend
app.use(express.json());
app.use(cors());

app.use("/", userRoutes);
app.use("/upload", uploadRoutes);

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);

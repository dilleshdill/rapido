import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from 'http'
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import driverRoutes from "./routes/driverRoute.js";
import checkCordinates from "./routes/checkCordinatesRoute.js";
import ridesRoute from "./routes/ridesRouter.js";
import driverSocket from "./sockets/driverSocket.js";

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",   
    methods: ["GET", "POST"]
  }
});

export default io

driverSocket(io)

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/", userRoutes);
app.use("/driver",driverRoutes);
app.use("/check",checkCordinates)
app.use("/upload", uploadRoutes);
app.use("/rides",ridesRoute)

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);

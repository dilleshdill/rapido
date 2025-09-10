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
import crypto from "crypto";

import Razorpay from 'razorpay'


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

const razorpay = new Razorpay({
  key_id: 'rzp_test_VokWRKJcLaw2Fy'
,
  key_secret: 'lY9F0jnzhLsn721LHkRqPg8f',
});

app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    if (!amount || !currency || !receipt) {
      return res.status(400).send("Missing payment parameters");
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error.message);
    res.status(500).send("Payment creation failed");
  }
});


app.post("/api/payment/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).send("Missing parameters");
    }

    const expectedSignature = crypto
      .createHmac("sha256",'lY9F0jnzhLsn721LHkRqPg8f' )
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ status: "Payment verified" });
    } else {
      return res.status(400).send("Payment verification failed");
    }
  } catch (error) {
    console.error("Payment verification error:", error.message);
    return res.status(500).send("Server error");
  }
});

server.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);

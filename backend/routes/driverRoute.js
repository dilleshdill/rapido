import express from "express";
import {addDriver} from "../controllers/driverController.js";
const driverRoutes = express.Router();

// Example route for driver
driverRoutes.post("/add-driver", addDriver);
export default driverRoutes;
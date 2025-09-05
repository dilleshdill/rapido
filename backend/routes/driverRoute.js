import express from "express";
import {addDriver,driverLogin} from "../controllers/driverController.js";
const driverRoutes = express.Router();

// Example route for driver
driverRoutes.post("/add-driver", addDriver);
driverRoutes.post("/login",driverLogin)
export default driverRoutes;
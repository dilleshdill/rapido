import express from "express";
import {addDriver,driverLogin,driverRides} from "../controllers/driverController.js";
const driverRoutes = express.Router();

// Example route for driver
driverRoutes.post("/add-driver", addDriver);
driverRoutes.post("/login",driverLogin)
driverRoutes.get("/all-rides",driverRides)
export default driverRoutes;
import express from "express";
import {addDriver,driverLogin,driverRides} from "../controllers/driverController.js";
import authenticate from "../middleware/authentication.js";
const driverRoutes = express.Router();

// Example route for driver
driverRoutes.post("/add-driver", addDriver);
driverRoutes.post("/login",driverLogin)
driverRoutes.get("/all-rides",authenticate,driverRides)
export default driverRoutes;
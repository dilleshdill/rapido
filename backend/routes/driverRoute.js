import express from "express";
import {addDriver,driverLogin,driverRides,getDetailes} from "../controllers/driverController.js";
import authenticate from "../middleware/authentication.js";
const driverRoutes = express.Router();

// Example route for driver
driverRoutes.post("/add-driver", addDriver);
driverRoutes.post("/login",driverLogin)
driverRoutes.get("/all-rides",authenticate,driverRides)
driverRoutes.get("/getDriverDetailes",authenticate,getDetailes)
export default driverRoutes;
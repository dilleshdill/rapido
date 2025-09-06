import expres from "express";
import {createRide,getRides} from "../controllers/ridesController.js";
import authenticate from "../middleware/authentication.js";

const ridesRoute = expres.Router();
ridesRoute.post("/",authenticate,createRide);
ridesRoute.get("/ride-details",getRides)

export default ridesRoute;
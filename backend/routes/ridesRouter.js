import expres from "express";
import createRide from "../controllers/ridesController.js";
import authenticate from "../middleware/authentication.js";

const ridesRoute = expres.Router();
ridesRoute.post("/",authenticate,createRide);

export default ridesRoute;
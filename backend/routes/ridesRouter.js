import expres from "express";
import createRide from "../controllers/ridesController.js";

const ridesRoute = expres.Router();
ridesRoute.post("/",createRide);

export default ridesRoute;
import express from "express";
import { addUser, listUsers,getUserRides,userDetailes,ratingSubmited} from "../controllers/userControllers.js";
import authenticate from "../middleware/authentication.js";

const router = express.Router();

router.post("/add", addUser); 
router.get("/", listUsers); 
router.get("/all-rides",authenticate,getUserRides)  
router.get("/userDetailes",authenticate,userDetailes)
router.post("/submitRating",authenticate,ratingSubmited)

export default router;

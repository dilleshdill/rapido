import express from "express";
import { addUser, listUsers,getUserRides } from "../controllers/userControllers.js";
import authenticate from "../middleware/authentication.js";

const router = express.Router();

router.post("/add", addUser); 
router.get("/", listUsers); 
router.get("/all-rides",authenticate,getUserRides)  

export default router;

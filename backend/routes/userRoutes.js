import express from "express";
import { addUser, listUsers } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/add", addUser); 
router.get("/", listUsers);   

export default router;

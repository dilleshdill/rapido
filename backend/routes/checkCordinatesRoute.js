import express from "express";
import check from '../controllers/checkCordinateController.js'

const checkCordinates = express.Router();

checkCordinates.post("/locations",check)

export default checkCordinates;
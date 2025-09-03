const express = require("express");
const { addUser, listUsers } = require("../controllers/userControllers");

const router = express.Router();

router.post("/add", addUser); 
router.get("/", listUsers);   

module.exports = router;

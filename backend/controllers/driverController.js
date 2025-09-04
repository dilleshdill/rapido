import express from "express";
import Driver from "../models/driverModel.js";
async function addDriver(req, res) {
    // console.log(req.body);
  const {city,drivingLicenceImage1,drivingLicenceImage2,email,firstName,lastName,licenceNumber,password,phoneNumber,vehicleBackImage,vehicleFrontImage,vehicleNumber,vehicleType} = req.body;
  try {
    const user = await Driver.createDriver(city,drivingLicenceImage1,drivingLicenceImage2,email,firstName,lastName,licenceNumber,password,phoneNumber,vehicleBackImage,vehicleFrontImage,vehicleNumber,vehicleType);
    // return generateUserToken(res, user);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export { addDriver };
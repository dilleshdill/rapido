import pool from "../config/db.js";

async function createDriver(
  city,
  drivingLicenceImage1,
  drivingLicenceImage2,
  email,
  firstName,
  lastName,
  licenceNumber,
  password,
  phoneNumber,
  vehicleBackImage,
  vehicleFrontImage,
  vehicleNumber,
  vehicleType
) {
  const result = await pool.query(
    `INSERT INTO drivers (
        firstname,
        lastname,
        email,
        password,
        phonenumber,
        city,
        driving_licence_number,
        driving_licence_front_url,
        driving_licence_back_url,
        vehicle_type,
        vehicle_number,
        vehicle_front_image_url,
        vehicle_back_image_url,
        driver_image_url
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    ) RETURNING *`,
    [
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      city,
      licenceNumber,
      drivingLicenceImage1,
      drivingLicenceImage2,
      vehicleType,
      vehicleNumber,
      vehicleFrontImage,
      vehicleBackImage,
      "", // driver_image_url (empty for now)
    ]
  );

  return result.rows[0];
}


export default { createDriver };
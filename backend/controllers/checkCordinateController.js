import express from "express";
import pool from "../config/db.js";


async function isPointInside(lat, lng) {
  const query = `
    SELECT city_name
    FROM service_zones
    WHERE ST_Contains(
      ST_SetSRID(ST_GeomFromGeoJSON(boundary_lat_lng::text), 4326),
      ST_SetSRID(ST_MakePoint($1, $2), 4326)
    );`;

  const result = await pool.query(query, [lng, lat]);
  return result.rows.length > 0 ? result.rows[0].city_name : null;
}

const check = async(req,res) =>{
    const { pickup,drop,loc1,loc2 } = req.body;
    
    const pickupCity = await isPointInside(loc1.lat, loc1.lon);
    const dropCity = await isPointInside(loc2.lat, loc2.lon);

    if (pickupCity && dropCity && pickupCity === dropCity){
        console.log("data in safe zone")
        return res.status(200).json({ pickupCity, dropCity });
    }

    else{
        console.log("data not in safe zone")
        return res.status(400).json({ message: "One or both locations are outside service zones." });
        
    }

}

export default check;
import pool from "../config/db.js";

const createRide = async (req, res) => {
    
    const { vehicle,pickup,drop,distance,price,pickupLat,pickupLon,dropLat,dropLon } = req.body;
    console.log(req.body)
    try {
            const result = await pool.query(
                `INSERT INTO rides (user_id, pickup_lat, pickup_lon, drop_lat, drop_lon, amount,distance,city,status,driver_id,name,vehicle)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
                RETURNING *`,
                [1,pickupLat,pickupLon,dropLat,dropLon,price,distance,pickup.split(",")[0],"pending",null,null,vehicle]
            )

            res.status(200).json(result.rows[0]);
    }
    catch (err) {

        res.status(500).json({ error: err.message });
    }
};

export default createRide ;
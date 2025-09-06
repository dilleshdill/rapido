import pool from "../config/db.js";
import io from "../server.js";

const createRide = async (req, res) => {
    const { id, email } = req.user;
    let ride; // FIXED
    const { vehicle, pickup, drop, distance, price, pickupLat, pickupLon, dropLat, dropLon } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO rides (user_id, pickup_lat, pickup_lon, drop_lat, drop_lon, amount, distance, city, status, driver_id, name, vehicle)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)                
             RETURNING *`,
            [id, pickupLat, pickupLon, dropLat, dropLon, price, distance, pickup.split(",")[0], "pending", null, null, vehicle]
        );

        ride = result.rows[0];
        res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    const radius = 5;
    const query = `
        SELECT *
        FROM (
            SELECT driver_id, lat, lng,
                (6371 * acos(
                    cos(radians($1)) * cos(radians(lat)) *
                    cos(radians(lng) - radians($2)) +
                    sin(radians($1)) * sin(radians(lat))
                )) AS distance_km
            FROM drivers_rides
            WHERE is_available = TRUE
        ) AS distances
        WHERE distance_km <= $3
        ORDER BY distance_km
        LIMIT 5;
    `;

    const sortedDist = await pool.query(query, [pickupLat, pickupLon, radius]);
    console.log("drivers available", sortedDist.rows);

    const getDrivers = async (ride, data, index) => {
        if (data.rows.length <= index) {
            await pool.query(
                `UPDATE rides SET status = 'cancelled' WHERE id = $1`, [ride.id]
            );
            console.log("ride canceled");
            io.to(ride.user_id.toString()).emit("rideCancel", ride.id);
            return;
        }

        const driver = data.rows[index];

        io.to(driver.driver_id.toString()).emit("newRide", {
            rideId: ride.id,
            distance,
            price,
            pickupLat,
            pickupLon,
            dropLat,
            dropLon
        });

        // Wait before trying next driver
        setTimeout(async () => {
            const res = await pool.query(`SELECT * FROM rides WHERE id = $1`, [ride.id]);
            if (res.rows.length > 0 && res.rows[0].status === "pending") {
                getDrivers(ride, data, index + 1);
            }
        }, 5000); // wait 15 seconds
    };

    getDrivers(ride, sortedDist, 0);
};

export default createRide;

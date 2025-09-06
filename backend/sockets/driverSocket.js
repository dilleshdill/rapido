import pool from "../config/db.js";

const driverSocket = (io) => {
  io.on("connection", (socket) => {
    
    socket.on("driverId", (driverId) => {
      socket.driverId = driverId;
      socket.join(driverId.toString());
      console.log("Driver connected:", driverId);
    });

    
    socket.on("rideAccepted", async (rideId) => {
      if (!socket.driverId) return;

      try {
        const rides = await pool.query(`SELECT * FROM rides WHERE id = $1`, [rideId]);
        if (rides.rows.length === 0 || rides.rows[0].status !== "pending") {
          io.to(socket.driverId.toString()).emit("rideUnavailable", rideId);
          return;
        }

        await pool.query(
          `UPDATE rides SET status = 'ongoing', driver_id = $1 WHERE id = $2`,
          [socket.driverId, rideId]
        );

        
        // await pool.query(
        //   `UPDATE drivers_rides SET is_available = FALSE WHERE driver_id = $1`,
        //   [socket.driverId]
        // );

        console.log("Ride confirmed for driver", socket.driverId,rides.rows[0].user_id);

        io.to(rides.rows[0].user_id.toString()).emit("rideConfirmed", rides);
        const driverRow = await pool.query(
            `SELECT * FROM drivers_rides WHERE driver_id = $1`, [socket.driverId]
            );

            let driver = driverRow.rows[0];
            console.log("in driverSocket.js", driver);

            const getDriverDistance = (dlat, dlon, ulat, ulon) => {
    const step = 0.0003;

    if (dlat < ulat) dlat += step;
    else dlat -= step;

    if (dlon < ulon) dlon += step;
    else dlon -= step;

    return { lat: dlat, lng: dlon }; 
};

// Haversine formula to calculate distance in meters
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2)**2 +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // distance in meters
};

// Interval to simulate driver moving
const interval = setInterval(() => {
    driver = getDriverDistance(
        driver.lat,
        driver.lng,
        rides.rows[0].pickup_lat,
        rides.rows[0].pickup_lon
    );

    const distance = getDistance(
        driver.lat,
        driver.lng,
        rides.rows[0].pickup_lat,
        rides.rows[0].pickup_lon
    );

    // Emit driver location every step
    socket.emit("driverLocation", { driver, distance });

    console.log("Driver:", driver, "Distance to user:", distance.toFixed(2), "m");

    // Check if driver has arrived
    if (distance < 50) {
        socket.emit("DriverArrived", { message: "Driver has arrived!" });
        clearInterval(interval); // stop simulation
    }

}, 2000);



      } catch (err) {
        console.error("rideAccepted error:", err.message);
      }
    });

    
    socket.on("rideDeclined", async (rideId) => {
      console.log("Ride declined by driver", socket.driverId);
      try {
        await pool.query(
          `UPDATE rides SET status = 'cancelled' WHERE id = $1`,
          [rideId]
        );
      } catch (err) {
        console.error("rideDeclined error:", err.message);
      }
    });
  });
};

export default driverSocket;

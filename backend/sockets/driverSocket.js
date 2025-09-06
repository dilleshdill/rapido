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

        
        await pool.query(
          `UPDATE drivers_rides SET is_available = FALSE WHERE driver_id = $1`,
          [socket.driverId]
        );

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

            const interval = setInterval(() => {
            driver = getDriverDistance(
                driver.lat,
                driver.lng,
                rides.rows[0].pickup_lat,
                rides.rows[0].pickup_lon 
            );

            console.log(
                "in driversocketjs",
                driver.lat,
                driver.lng,
                rides.rows[0].pickup_lat,
                rides.rows[0].pickup_lon
            );

            
            socket.emit("driverLocation", driver); 
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

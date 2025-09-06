import pool from "../config/db.js";

const driverSocket = (io) => {
  io.on("connection", (socket) => {
    // Driver registers himself
    socket.on("driverId", (driverId) => {
      socket.driverId = driverId;
      socket.join(driverId.toString());
      console.log("Driver connected:", driverId);
    });

    // Driver accepts ride
    socket.on("rideAccepted", async (rideId) => {
      if (!socket.driverId) return;

      try {
        const rides = await pool.query(`SELECT * FROM rides WHERE id = $1`, [rideId]);

        if (rides.rows.length === 0 || rides.rows[0].status !== "pending") {
          io.to(socket.driverId.toString()).emit("rideUnavailable", rideId);
          return;
        }

        // Update ride status and assign driver
        await pool.query(
          `UPDATE rides SET status = 'ongoing', driver_id = $1 WHERE id = $2`,
          [socket.driverId, rideId]
        );

        // Mark driver unavailable
        await pool.query(
          `UPDATE drivers_rides SET is_available = FALSE WHERE driver_id = $1`,
          [socket.driverId]
        );

        console.log("Ride confirmed for driver", socket.driverId);

        io.to(rides.rows[0].user_id.toString()).emit("rideConfirmed", {
          rideId,
          driverId: socket.driverId,
        });

      } catch (err) {
        console.error("rideAccepted error:", err.message);
      }
    });

    // Driver declines ride
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

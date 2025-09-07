import pool from "../config/db.js";

const driverSocket = (io) => {
  io.on("connection", (socket) => {

    // ---------------- DRIVER ----------------
    socket.on("driverId", (driverId) => {
      socket.driverId = driverId;
      socket.join(driverId.toString());
      console.log("Driver connected:", driverId);
    });

    // ---------------- USER ----------------
    socket.on("userId", (userId) => {
      socket.userId = userId.toString();
      socket.join(socket.userId); // Only the user's socket joins their own room
      console.log(`User ${socket.userId} joined room user_${socket.userId}`);
    });

    // ---------------- RIDE ACCEPT ----------------
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

        const userId = rides.rows[0].user_id.toString();

        // Fetch sockets in the room
        const socketsInRoom = await io.in(userId).fetchSockets();
        console.log("Sockets in room for user", userId, ":", socketsInRoom.map(s => s.id));

        if (socketsInRoom.length > 0) {
          io.to(userId).emit("rideSuccess", rides.rows[0]);
          io.to(socket.driverId.toString()).emit("rideConfirmed", rides.rows[0]);
          console.log(`✅ rideSuccess emitted to user ${userId}`);
        } else {
          console.log(`⚠️ User ${userId} not connected yet`);
        }

      } catch (err) {
        console.error("rideAccepted error:", err.message);
      }
    });

    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", () => {
      if (socket.userId) {
        console.log(`User disconnected: ${socket.userId}, Socket ID: ${socket.id}`);
      }
      if (socket.driverId) {
        console.log(`Driver disconnected: ${socket.driverId}, Socket ID: ${socket.id}`);
      }
    });

  });
};

export default driverSocket;

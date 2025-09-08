import pool from "../config/db.js";

const driverSocket = (io) => {
  
  const connectedUsers = new Map();   
  const connectedDrivers = new Map();

  io.on("connection", (socket) => {
    
    socket.on("driverId", (driverId) => {
      socket.driverId = driverId.toString();
      const driverRoom = socket.driverId.toString();
      socket.join(driverRoom);

      connectedDrivers.set(socket.driverId, socket.id);
      console.log(`🚖 Driver connected: ${socket.driverId}, Room: ${driverRoom}`,connectedDrivers,connectedUsers);
    });

    // ---------------- USER ----------------
    socket.on("userId", (userId) => {
      socket.userId = userId.toString();
      const userRoom = socket.userId.toString();
      socket.join(userRoom);

      connectedUsers.set(socket.userId, socket.id);
      console.log(`🙋 User connected: ${socket.userId}, Room: ${userRoom}`,connectedDrivers,connectedUsers);
    });

    // ---------------- RIDE ACCEPTED ----------------
    socket.on("rideAccepted", async (rideId) => {
      if (!socket.driverId) return;

      try {
        const rides = await pool.query(`SELECT * FROM rides WHERE id = $1`, [rideId]);
        console.log(rides.rows[0],)
        if (rides.rows.length === 0 || rides.rows[0].status !== "pending") {
          io.to(`driver_${socket.driverId}`).emit("rideUnavailable", rideId);
          return;
        }

        await pool.query(
          `UPDATE rides SET status = 'ongoing', driver_id = $1 WHERE id = $2`,
          [socket.driverId, rideId]
        );


        const driverData = await pool.query(`SELECT * FROM drivers_rides WHERE driver_id = $1`,[socket.driverId])
        console.log(rides.rows[0].user_id)
        io.to(rides.rows[0].user_id).emit("rideSuccess",rides.rows[0])
        io.to(socket.driverId.toString()).emit("rideConfirmed", rides.rows[0]);
        
        
        let pickuplat = rides.rows[0].pickup_lat;
        let pickuplon = rides.rows[0].pickup_lon;
        console.log(pickuplat, pickuplon);



        let driver = { lat: driverData.rows[0].lat, lon: driverData.rows[0].lng };


        const moveDriver = (driverLat, driverLon, pickuplat, pickuplon) => {
          const step = 0.00003;

          if (driverLat < pickuplat) driverLat += step;
          else driverLat -= step;

          if (driverLon < pickuplon) driverLon += step;
          else driverLon -= step;

          return { lat: driverLat, lon: driverLon };
        };


        const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
          const R = 6371000; // meters
          const toRad = (deg) => (deg * Math.PI) / 180;

          const φ1 = toRad(lat1);
          const φ2 = toRad(lat2);
          const Δφ = toRad(lat2 - lat1);
          const Δλ = toRad(lon2 - lon1);

          const a =
            Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          return R * c;
        };


        const interval = setInterval(() => {
          driver = moveDriver(driver.lat, driver.lon, pickuplat, pickuplon);

          const distanceMeters = getDistanceMeters(driver.lat, driver.lon, pickuplat, pickuplon);

          console.log(`Driver: ${driver.lat}, ${driver.lon} | Distance: ${distanceMeters}m`);

          
          io.to(socket.driverId.toString()).emit("driverLocation", {
            driver,
            distanceMeters,
            pickup: { lat: pickuplat, lon: pickuplon },
          });

          
          if (distanceMeters < 50) {
            clearInterval(interval);
            io.to(socket.driverId.toString()).emit("driverArrived", {
              driver,
              pickup: { lat: pickuplat, lon: pickuplon },
            });
            console.log("✅ Driver has arrived at pickup location!");
          }
        }, 3000);



      } catch (err) {
        console.error("rideAccepted error:", err.message);
      }
    });




    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`❌ User disconnected: ${socket.userId}, Socket ID: ${socket.id}`);
      }
      if (socket.driverId) {
        connectedDrivers.delete(socket.driverId);
        console.log(`❌ Driver disconnected: ${socket.driverId}, Socket ID: ${socket.id}`);
      }
    });
  });
};

export default driverSocket;

import pool from "../config/db.js";
import axios from "axios";

const driverSocket = (io) => {
  const connectedUsers = new Map();
  const connectedDrivers = new Map();

  io.on("connection", (socket) => {
    // ---------------- DRIVER ----------------
    socket.on("driverId", (driverId) => {
      socket.driverId = driverId.toString();
      const driverRoom = socket.driverId.toString();
      socket.join(driverRoom);

      connectedDrivers.set(socket.driverId, socket.id);
      console.log(`🚖 Driver connected: ${socket.driverId}, Room: ${driverRoom}`, connectedDrivers, connectedUsers);
    });

    // ---------------- USER ----------------
    socket.on("userId", (userId) => {
      socket.userId = userId.toString();
      const userRoom = socket.userId.toString();
      socket.join(userRoom);

      connectedUsers.set(socket.userId, socket.id);
      console.log(`🙋 User connected: ${socket.userId}, Room: ${userRoom}`, connectedDrivers, connectedUsers);
    });

    // ---------------- RIDE ACCEPTED ----------------
   socket.on("rideAccepted", async (rideId) => {
  if (!socket.driverId) return;

  try {
    const rides = await pool.query(`SELECT * FROM rides WHERE id = $1`, [rideId]);
    if (rides.rows.length === 0 || rides.rows[0].status !== "pending") {
      io.to(socket.driverId).emit("rideUnavailable", rideId);
      return;
    }

    // Update ride and driver availability
    await pool.query(
      `UPDATE rides SET status = 'ongoing', driver_id = $1 WHERE id = $2`,
      [socket.driverId, rideId]
    );
    await pool.query(
      `UPDATE drivers_rides SET is_available = FALSE WHERE driver_id = $1`,
      [socket.driverId]
    );

    const newRides = await pool.query(`SELECT * FROM rides WHERE id = $1`, [rideId]);
    const driverData = await pool.query(`SELECT * FROM drivers_rides WHERE driver_id = $1`, [socket.driverId]);

    io.to(rides.rows[0].user_id.toString()).emit("rideSuccess", newRides.rows[0]);
    io.to(socket.driverId.toString()).emit("rideConfirmed", newRides.rows[0]);

    // Pickup and drop coordinates
    const pickuplat = rides.rows[0].pickup_lat;
    const pickuplon = rides.rows[0].pickup_lon;
    const droplat = rides.rows[0].drop_lat;
    const droplon = rides.rows[0].drop_lon;
    const drop = { lat: droplat, lon: droplon };
    let driver = { lat: driverData.rows[0].lat, lon: driverData.rows[0].lng };

    console.log("Pickup:", pickuplat, pickuplon, "Driver start:", driver);

    // ---------------- FETCH ROUTE DRIVER → PICKUP ----------------
    const url = `http://router.project-osrm.org/route/v1/driving/${driver.lon},${driver.lat};${pickuplon},${pickuplat}?geometries=geojson`;
    const res = await axios.get(url);
    if (!res.data.routes || res.data.routes.length === 0) {
      console.error("No route found to pickup");
      return;
    }
    const routeCoords = res.data.routes[0].geometry.coordinates;

    // ---------------- SIMULATE DRIVER MOVEMENT TO PICKUP ----------------
    let step = 0;
    const interval = setInterval(async () => {
      if (step >= routeCoords.length) {
        clearInterval(interval);

        await pool.query(
          `UPDATE drivers_rides SET lat = $1, lng = $2 WHERE driver_id = $3`,
          [driver.lat, driver.lon, socket.driverId]
        );

        io.to(socket.driverId.toString()).emit("driverArrived", {
          pickup: { lat: pickuplat, lon: pickuplon },
          drop: drop
        });
        console.log("✅ Driver arrived at pickup location!");
        return;
      }

      const [lon, lat] = routeCoords[step];
      driver = { lat, lon };
      step++;

      io.to(socket.driverId.toString()).emit("driverLocation", {
        driver,
        pickup: { lat: pickuplat, lon: pickuplon },
      });
      io.to(rides.rows[0].user_id.toString()).emit("driverLocation", {
        driver,
        pickup: { lat: pickuplat, lon: pickuplon },
      });

      console.log(`Driver to Pickup: ${driver.lat}, ${driver.lon}`);
    }, 5000);

    // ---------------- FETCH ROUTE PICKUP → DROP ----------------
    const newRoute = `http://router.project-osrm.org/route/v1/driving/${pickuplon},${pickuplat};${droplat},${droplon}?geometries=geojson`;
    const newRes = await axios.get(newRoute);
    if (!newRes.data.routes || newRes.data.routes.length === 0) {
      console.log("No route found from pickup to drop");
      return;
    }

    const newRoutes = newRes.data.routes[0].geometry.coordinates;
    console.log("Route from Pickup to Drop:", newRoutes);

    // ---------------- SIMULATE DRIVER MOVEMENT TO DROP ----------------
    let count = 0;
    const pickupDropInterval = setInterval(async () => {
      if (count >= newRoutes.length) {
        io.to(socket.driverId.toString()).emit("rideCompleted", {
          pickup: { lat: pickuplat, lon: pickuplon },
          drop: drop
        });

        await pool.query(
          `UPDATE rides SET status = 'success' WHERE id = $1`,
          [rideId]
        );

        await pool.query(
          `UPDATE drivers_rides SET lat = $1, lng = $2, is_available=TRUE WHERE driver_id = $3`,
          [drop.lat, drop.lon, socket.driverId]
        );

        clearInterval(pickupDropInterval);
        console.log("Driver reached destination", drop.lat, drop.lon);
        return;
      }

      const [lon, lat] = newRoutes[count];
      driver = { lat, lon };

      io.to(socket.driverId.toString()).emit("driverLocation", {
        driver,
        drop: drop
      });

      

      console.log(`Driver to Drop: ${driver.lat}, ${driver.lon}`);
      count++;
    }, 5000);

    // ---------------- CLEAR INTERVALS ON DISCONNECT ----------------
    

  } catch (err) {
    console.error("rideAccepted error:", err.message);
  }
});


    // ---------------- RIDE DECLINED ----------------
    socket.on("rideDeclined", async (rideId) => {
      console.log("Ride Cancelled By User ", rideId);
      
      if (socket.driverId) {
        await pool.query(
          `UPDATE drivers_rides SET is_available = TRUE WHERE driver_id = $1`,
          [socket.driverId]
        );
      }
    });

    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`User disconnected: ${socket.userId}, Socket ID: ${socket.id}`);
      }
      if (socket.driverId) {
        connectedDrivers.delete(socket.driverId);
        console.log(`Driver disconnected: ${socket.driverId}, Socket ID: ${socket.id}`);
      }
    });
  });
};

export default driverSocket;

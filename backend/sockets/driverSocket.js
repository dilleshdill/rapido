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

        
        let pickuplat = rides.rows[0].pickup_lat;
        let pickuplon = rides.rows[0].pickup_lon;
        let droplat = rides.rows[0].drop_lat;
        let droplon = rides.rows[0].drop_lon;
        let driver = { lat: driverData.rows[0].lat, lon: driverData.rows[0].lng };

        console.log("Pickup:", pickuplat, pickuplon, "Driver start:", driver);


  

        // ---------------- FETCH REAL ROUTE FROM OSRM ----------------
        const url = `http://router.project-osrm.org/route/v1/driving/${driver.lon},${driver.lat};${pickuplon},${pickuplat}?geometries=geojson`;
        const res = await axios.get(url);
        if (!res.data.routes || res.data.routes.length === 0) {
          console.error("No route found");
          return;
        }
        const routeCoords = res.data.routes[0].geometry.coordinates; 

        

        // ---------------- SIMULATE DRIVER MOVEMENT ----------------
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
              drop  : {lat:droplat,lon:droplon}

            });
            console.log("✅ Driver arrived at pickup location!");
            return;
          }

          const [lon, lat] = routeCoords[step];
          driver = { lat, lon };
          step++;

          console.log(`Driver: ${driver.lat}, ${driver.lon}`);

          
          io.to(socket.driverId.toString()).emit("driverLocation", {
            driver,
            pickup: { lat: pickuplat, lon: pickuplon },
          });

          io.to(rides.rows[0].user_id.toString()).emit("driverLocation", {
            driver,
            pickup: { lat: pickuplat, lon: pickuplon },
          });

  
        }, 5000); 


        const newRoute = `http://router.project-osrm.org/route/v1/driving/${pickuplon},${pickuplat};${droplat},${droplon}?geometries=geojson`;
        const newRes = await axios.get(newRoute)

        if (!newRes.data.routes || res.data.routes.length===0){
          console.log("No Route Found")
          return
        }

        const newRoutes = newRes.data.routes[0].geometry.coordinates
        console.log("new Rotues pickup to drop",newRoutes)
        console.log("new Rotues pickup to drop" , newRes.data.routes[0])

        let count  = 0 
        const pickupDropInterval = setInterval(async() => {
          if (count >= newRoutes.length){
            io.to(socket.driverId.toString()).emit("rideCompleted",{
              pickup: { lat: pickuplat, lon: pickuplon },
              drop  : {lat:droplat,lon:droplon}
            })
            await pool.query(
              `UPDATE rides SET status = 'success' WHERE id = $1`,[rideId]
            )

            clearInterval(pickupDropInterval)

           await pool.query(
              `UPDATE drivers_rides SET lat = $1,lng = $2,is_available=TRUE  WHERE driver_id = $3`,
              [drop.lat, drop.lon, socket.driverId] 
            )

            console.log("Driver Reached To Destination",drop.lat,drop.lon)
          }

          let [lat,lon] = newRoutes[count]
          const newDriver = {lat:lat,lon:lon}
          console.log(newDriver)
          io.to(socket.driverId).emit("driverLocation", {
            driver: newDriver,
            drop: {lat: droplat, lon: droplon}
          })

          console.log(`Driver: ${driver.lat}, ${driver.lon}`);

          count +=1

        }, 5000);

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

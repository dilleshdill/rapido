import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import DriverMap from "../components/DriverMap";

const socket = io("http://localhost:5000");

const DriverHome = () => {
  const [ride, setRide] = useState(null);
  const [driverLatLng, setDriverLatLng] = useState(null);
  const [pickup, setPickup] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showRide, setShowRide] = useState(false);

  useEffect(() => {
    socket.emit("driverId", 4);

    // New ride request
    socket.on("newRide", (rideData) => {
      setShowRide(true);
      setShowMap(false);
      console.log("📦 New ride request:", rideData);
      setRide(rideData);
    });

    // Ride confirmed
    socket.on("rideConfirmed", (rideData) => {
      setShowRide(false);
      setShowMap(true);
      console.log("✅ Ride confirmed:", rideData);
      setRide(rideData);
    });

    // Driver location updates
    socket.on("driverLocation", (locationDetails) => {
      console.log("📍 Driver location update:", locationDetails);

      setShowRide(false);
      setShowMap(true);

      if (locationDetails.driver) {
        setDriverLatLng({
          lat: locationDetails.driver.lat,
          lon: locationDetails.driver.lon,
        });
      }

      if (locationDetails.pickup) {
        setPickup({
          lat: locationDetails.pickup.lat,
          lon: locationDetails.pickup.lon,
        });
      }

      localStorage.setItem("driverLocations", JSON.stringify(locationDetails));
    });

    return () => {
      socket.off("driverLocation");
      socket.off("driverId");
      socket.off("newRide");
      socket.off("rideConfirmed");
    };
  }, []);

  return (
    <div className="p-6">
      {showMap && !showRide && (
        <DriverMap driverLatLng={driverLatLng} pickup={pickup} />
      )}

      {/* Ride request modal */}
      {showRide && ride && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-2xl font-bold mb-4">New Ride Request</h2>

            <p className="mb-2">
              <strong>Distance:</strong> {ride.distance} km
            </p>
            <p className="mb-4">
              <strong>Estimated Price:</strong> ₹{ride.amount}
            </p>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => socket.emit("rideAccepted", ride.rideId)}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  socket.emit("rideDeclined", ride.rideId);
                  setRide(null);
                  setShowRide(false);
                }}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverHome;

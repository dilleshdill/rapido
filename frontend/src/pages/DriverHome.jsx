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
  const [rideData, setRideData] = useState(null);
  const timer = localStorage.getItem('timer')
  const [driverArrivedData,setDriverArrivedData] = useState(null)
  useEffect(() => {
    // Load any stored ride data (for refresh)
    const rideDataStr = localStorage.getItem("rideConfirmed");
    if (rideDataStr) {
      setRideData(JSON.parse(rideDataStr));
      setShowMap(true);
    }

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
      localStorage.setItem("rideConfirmed", JSON.stringify(rideData));
      setRideData(rideData);
    });
    // Driver Arrived

    socket.on('driverArrived',(rideData) =>{
      console.log("✅ Driver Arrived:", rideData);

      localStorage.setItem("driverArrived", JSON.stringify(rideData));
      setDriverArrivedData(rideData);
      setPickup({
          lat: rideData.drop.lat,
          lon: rideData.drop.lon,
        });
      alert('Driver Arrived');
    })

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
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen w-screen">
      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* Map Section */}
        {showMap && !showRide && (
          <>
            <div className="w-full md:w-2/3 h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow-md border">
              <DriverMap driverLatLng={driverLatLng} pickup={pickup} />
            </div>

            {/* Ride Details */}
            {rideData && (
              <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-6 space-y-4">
                <div className="flex border-b justify-between">
                  <h2 className="text-xl font-bold text-gray-800  pb-2">
                  Ride Details
                </h2>
                <p className="text-gray-700">
                  <strong>Driver Arrived In :</strong> {timer.slice(0,2)} Minutes
                </p>
                </div>
                <p className="text-gray-700">
                  <strong>Amount:</strong> ₹{rideData.amount}
                </p>
                <p className="text-gray-700">
                  <strong>City:</strong> {rideData.city}
                </p>
                <p className="text-gray-700">
                  <strong>Distance:</strong> {rideData.distance} km
                </p>
                <p className="text-gray-700">
                  <strong>Vehicle:</strong> {rideData.vehicle}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      rideData.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {rideData.status}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong>User ID:</strong> {rideData.user_id}
                </p>
                
              </div>
            )}
          </>
        )}
      </div>

      {/* Ride Request Modal */}
      {showRide && ride && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              🚖 New Ride Request
            </h2>

            <p className="mb-2 text-gray-700">
              <strong>Distance:</strong> {ride.distance} km
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Estimated Price:</strong> ₹{ride.amount}
            </p>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 !bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                onClick={() => socket.emit("rideAccepted", ride.rideId)}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 !bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
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

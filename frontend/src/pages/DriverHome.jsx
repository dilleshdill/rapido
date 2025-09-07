import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io("http://localhost:5000");

export const DriverHome = () => {
  const [ride, setRide] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        
        socket.emit("driverId",4 ); 
        socket.on("newRide", (ride) => {
            console.log("newRide is set",ride)
        setRide(ride);
        });
        console.log("calling socket ")
        
        return () => {
        socket.off("driverID")
        socket.off("newRide");
        };
    }, []);

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Driver Home</h1>
      </div>

      {/* Ride request modal */}
      {ride && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-2xl font-bold mb-4">New Ride Request</h2>
            <p className="mb-2">
              <strong>Pickup Location:</strong> {ride.pickup}
            </p>
            <p className="mb-2">
              <strong>Drop Location:</strong> {ride.drop}
            </p>
            <p className="mb-2">
              <strong>Distance:</strong> {ride.distance} km
            </p>
            <p className="mb-4">
              <strong>Estimated Price:</strong> ₹{ride.amount}
            </p>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 !bg-green-500 text-white rounded  transition"
                onClick={() => {
                  socket.emit("rideAccepted", ride.rideId),navigate(`/booking-ride/${ride.rideId}`,{state:{rideDetails:ride}});
                  
                }}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 !bg-red-500 text-white rounded transition"
                onClick={() => 
                {
                    socket.emit("rideDeclined",ride.rideId)
                    setRide(null)
                }
                }
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

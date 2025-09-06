import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import OSMMap from "../components/OSMMap";

const socket = io("http://localhost:5000");

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;
    const [confirm,setConfirm] = useState(null)

  useEffect(()=>{
    socket.on("rideConfirmed",rides=>{
        setConfirm(rides)
        console.log("rideConfirmed",rides)
        
    });
    return () => {
      socket.off("rideConfimed");
    };
  },[confirm])
  // Map status to colors
  const statusColors = {
    pending: "text-yellow-600 px-2 py-1 ",
    confirmed: "text-green-700 px-2 py-1 ",
    completed: "text-blue-700 px-2 py-1 ",
    cancelled: "text-red-700 px-2 py-1 ",
  };

  if (!ride) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">No booking found. Please go back and book a ride.</p>
        <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center  w-screen bg-gray-100">

      <div className="w-screen bg-amber-400">
        <OSMMap />
      </div>
        <div className="bg-white h-screen p-8 rounded-2xl shadow-lg w-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Booking Status!</h2>

        <p className="mb-2">Vehicle: <strong>{ride.vehicle}</strong></p>
        <p className="mb-2">Pickup: <strong>{ride.city}</strong></p>
        <p className="mb-2">Distance: <strong>{ride.distance} km</strong></p>
        <p className="mb-4">Price: <strong>{ride.amount} ₹</strong></p>

        {/* Status with color */}
        <p className="mb-4">
          Status:{" "}
          <span className={statusColors[ride.status.toLowerCase()]}>
            <strong>{ride.status}</strong>
          </span>
        </p>

        <div className="flex">
            {/* <button
          className="px-6 py-2 !bg-yellow-400 text-white rounded-lg  transition"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button> */}
        {
            confirm && (
                <button
                    className="px-6 py-2 !bg-yellow-400 text-white rounded-lg  transition"
                    onClick={() => navigate(`/booking/:${confirm.id}`,state={rideDetails:confirm})}
                    >
                    Go to your Ride
                </button>
            )
        }
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

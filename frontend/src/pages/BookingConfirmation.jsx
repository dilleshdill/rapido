import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OSMMap from "../components/OSMMap";
import axios from "axios";
const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;
  const [confirm, setConfirm] = useState(null);

  useEffect(()=>{

    getData();
    // socket.on("rideSuccess", (data) => {
    // console.log("🎉 rideSuccess received:", data);
  },[]);

  // return () => {
  //   socket.off("rideSuccess");
  // };
  // },[])
  
  const statusColors = {
    pending: "text-yellow-600 px-2 py-1 ",
    confirmed: "text-green-700 px-2 py-1 ",
    completed: "text-blue-700 px-2 py-1 ",
    cancelled: "text-red-700 px-2 py-1 ",
  };

  const getData = async () => {
  try {
    console.log("Ride ID:", ride.id);

    const res = await axios.get(
      `http://localhost:5000/rides/ride-details?rideId=${ride.id}` // ✅ no space
    );
    if (res.status === 200) {
      setConfirm(res.data);
      localStorage.setItem('price',res.data.amount)
      console.log("Ride response:", res.data);
    }
  } catch (e) {
    console.error("Error fetching ride details:", e);
  }
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

  
  const displayRide = confirm || ride;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-screen bg-gray-100">
      
      <div className="w-full md:w-1/2 h-screen">
        <OSMMap pickuplat={displayRide.pickup_lat} pickuplng={displayRide.pickup_lon}/>
      </div>

      {/* Ride details */}
      <div className="bg-white h-screen p-8 rounded-2xl shadow-lg w-full md:w-1/2 text-center">
        <h2 className="text-2xl font-bold mb-4">Booking Status!</h2>

        <p className="mb-2">Vehicle: <strong>{displayRide.vehicle}</strong></p>
        <p className="mb-2">Pickup: <strong>{displayRide.city}</strong></p>
        <p className="mb-2">Distance: <strong>{displayRide.distance} km</strong></p>
        <p className="mb-4">Price: <strong>{displayRide.amount} ₹</strong></p>

        {/* Status with color */}
        <p className="mb-4">
          Status:{" "}
          <span className={statusColors[displayRide.status.toLowerCase()]}>
            <strong>{displayRide.status}</strong>
          </span>
        </p>

        <div className="flex justify-center">
          {confirm && confirm.status === "ongoing" && (
            <button
              className="px-6 py-2 !bg-yellow-400 text-white rounded-lg transition"
              onClick={() =>
                navigate('/driver-home', {
                  state: { rideDetails: confirm },
                })
              }
            >
              Go to your Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

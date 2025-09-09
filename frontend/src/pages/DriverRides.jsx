import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const DriverRides = () => {
  const [totalRides, setTotalRides] = useState([]);
const navigate = useNavigate()
  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await axios.get("http://localhost:5000/driver/all-rides", {
        headers: {
          Authorization: `Bearer ${Cookies.get("DriverToken")}`,
        },
      });

      console.log("Rides fetched:", response.data);
      if (response.status === 200) {
        setTotalRides(response.data);
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  const statusColors = {
    pending: "text-yellow-600  px-3 py-1 ",
    confirmed: "text-green-700  px-3 py-1 ",
    completed: "text-blue-700  px-3 py-1",
    cancelled: "text-red-700  px-3 py-1 ",
  };


  return (
    <div className="p-6 min-h-screen w-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">My Rides</h2>

      {totalRides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {totalRides.map((ride, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold mb-2">
                <span className="font-semibold">Vechile:</span> {ride.vehicle}
              </h3>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Pickup:</span> {ride.city}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Driver Id:</span> {ride.driver_id}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Booking Id:</span> {ride.id}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Distance:</span> {ride.distance} km
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Price:</span> ₹{ride.amount}
              </p>
              <p>
                <strong>Status:{" "}</strong>
                <span className={`font-bold ${statusColors[ride.status.toLowerCase()]}`}>
                  {ride.status}
                </span>
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Created At:</span> {ride.created_at?.slice(0, 10)}
                </p>
                <p className="text-gray-700 mb-1">
                <span className="font-semibold">CreatedTime:</span> {ride.created_at?.slice(11, 16)}
                </p>
                <div className="flex  mt-4 gap-2">
                    <button
                    onClick={()=>navigate(`/booking/${ride.id}`)}
                    className="mt-4 w-full !bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-500 transition">
                    View Details
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverRides;

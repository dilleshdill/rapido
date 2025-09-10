import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const DriverRides = () => {
  const [totalRides, setTotalRides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRides();
  }, []);

const fetchRides = async () => {
  try {
    const response = await axios.get("http://localhost:5000/driver/all-rides", {
      headers: {
        Authorization: `Bearer ${Cookies.get("authToken")}`,
      },
    });

    if (response.status === 200) {
      const ridesArray = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setTotalRides(ridesArray);
      console.log("Fetched rides:", ridesArray);
    } else {
      setTotalRides([]);
    }
  } catch (error) {
    console.error("Error fetching rides:", error);
    setTotalRides([]);
  }
};


  const statusColors = {
    pending: "text-yellow-600 px-3 py-1",
    confirmed: "text-green-700 px-3 py-1",
    ongoing: "text-purple-700 px-3 py-1",
    completed: "text-blue-700 px-3 py-1",
    cancelled: "text-red-700 px-3 py-1",
  };

  return (
    
    <div className="p-6 min-h-screen w-screen bg-gray-100">
      
      <div className="flex justify-between rounded-2xl  ">
        <h2 className="text-2xl font-bold mb-6">My Rides</h2>
        <div className="flex ">
          <Link to="/driver-home">
            <p className="text-lg font-semibold font-sans mr-5 cursor-pointer">Home</p>
          </Link>
          <Link to="/driver-profile">
            <p className="text-lg font-semibold font-sans mr-5 cursor-pointer">Profile</p>
          </Link>
        </div>
      </div>

      {totalRides.length === 0 ? (
        <Loader />
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {totalRides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold mb-2">
                <span className="font-semibold">Vehicle:</span> {ride.vehicle || "N/A"}
              </h3>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Pickup:</span> {ride.city || "N/A"}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Driver ID:</span> {ride.driver_id || "N/A"}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Booking ID:</span> {ride.id}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Distance:</span> {ride.distance || 0} km
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Price:</span> ₹{ride.amount || 0}
              </p>
              <p>
                <strong>Status: </strong>
                <span
                  className={`font-bold ${statusColors[ride.status?.toLowerCase()] || "text-gray-700"}`}
                >
                  {ride.status || "N/A"}
                </span>
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Created At:</span>{" "}
                {ride.created_at ? ride.created_at.slice(0, 10) : "N/A"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Created Time:</span>{" "}
                {ride.created_at ? ride.created_at.slice(11, 16) : "N/A"}
              </p>

              <div className="flex mt-4 gap-2">
                <button
                  onClick={() => navigate(`/booking/${ride.id}`)}
                  className="w-full !bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-500 transition"
                >
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

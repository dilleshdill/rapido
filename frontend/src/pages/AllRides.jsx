import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AllRides = () => {
  const [totalRides, setTotalRides] = useState([]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await axios.get("http://localhost:5000/all-rides", {
        headers: {
          Authorization: `Bearer ${Cookies.get("userToken")}`,
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
    pending: "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full",
    confirmed: "text-green-700 bg-green-100 px-2 py-1 rounded-full",
    completed: "text-blue-700 bg-blue-100 px-2 py-1 rounded-full",
    cancelled: "text-red-700 bg-red-100 px-2 py-1 rounded-full",
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">All Rides</h2>

      {totalRides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Vehicle</th>
                <th className="py-2 px-4 text-left">Pickup</th>
                <th className="py-2 px-4 text-left">Drop</th>
                <th className="py-2 px-4 text-left">Distance (km)</th>
                <th className="py-2 px-4 text-left">Price (₹)</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {totalRides.map((ride, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-2 px-4">{ride.vehicle}</td>
                  <td className="py-2 px-4">{ride.pickup}</td>
                  <td className="py-2 px-4">{ride.drop}</td>
                  <td className="py-2 px-4">{ride.distance}</td>
                  <td className="py-2 px-4">{ride.amount}</td>
                  <td className="py-2 px-4">
                    <span className={statusColors[ride.status.toLowerCase()]}>
                      {ride.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllRides;

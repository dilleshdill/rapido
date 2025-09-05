import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  if (!ride) {
    // If user navigates here directly without booking
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
        <p className="mb-2">Vehicle: <strong>{ride.vehicle}</strong></p>
        <p className="mb-2">Pickup: <strong>{ride.pickup}</strong></p>
        <p className="mb-2">Drop: <strong>{ride.drop}</strong></p>
        <p className="mb-2">Distance: <strong>{ride.distance} km</strong></p>
        <p className="mb-4">Price: <strong>{ride.price} ₹</strong></p>
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;

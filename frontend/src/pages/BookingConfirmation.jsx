import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get ride details passed from VehicleSelection page
  const ride = location.state?.ride;

  if (!ride) {
    // If page is opened directly without booking
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <p className="text-lg mb-4">No ride found. Please book a ride first.</p>
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">✅ Booking Confirmed!</h2>

        {/* Ride Details */}
        <div className="text-left space-y-2 mb-6">
          <p>
            <strong>Vehicle:</strong> {ride.vehicle}
          </p>
          <p>
            <strong>Pickup:</strong> {ride.pickup}
          </p>
          <p>
            <strong>Drop:</strong> {ride.drop}
          </p>
          <p>
            <strong>Distance:</strong> {ride.distance} km
          </p>
          <p>
            <strong>Price:</strong> {ride.price} ₹
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            onClick={() => navigate("/")}
          >
            Book Another Ride
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate("/my-rides")}
          >
            View My Rides
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

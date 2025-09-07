import { useState } from "react";
import PickPoints from "./PickPoints";
import OSMMap from "./OSMMap";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function BookingPage() {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [fare, setFare] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const rideDetails = location.state?.rideDetails;

  useEffect(() => {
    const socket = io("http://localhost:5000")
    
  } )


  const handleCalculateFare = async () => {
    if (!pickup || !drop) return alert("Please select both pickup and drop");

    try {
      // Use OSRM API to calculate real road distance
      const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?overview=false`;
      const res = await axios.get(url);
      const distanceKm = res.data.routes[0].distance / 1000; // meters → km

      const price = calculateFare(distanceKm, "Cab"); // can be Bike/Auto/Cab
      setFare(price.toFixed(2));
    } catch (err) {
      console.error("OSRM error:", err);
    }
  };



  return (
    <div className="flex flex-col md:flex-row gap-4 ">
      {/* <PickPoints setPickup={setPickup} setDrop={setDrop} /> */}
      <OSMMap pickup={pickup} setPickup={setPickup} drop={drop} setDrop={setDrop} />

      <div>
        <button 
            onClick={() => navigate('/wayto-destination', { state: { rideDetails }})}
        >
            Pickup to Destination
        </button>
    </div>

      {/* Ride details */}
      {/* <div className="bg-white h-screen p-8 rounded-2xl shadow-lg w-full md:w-1/2 text-center">
        <h2 className="text-2xl font-bold mb-4">Booking Status!</h2>

        <p className="mb-2">Vehicle: <strong>{rideDetails.vehicle}</strong></p>
        <p className="mb-2">Pickup: <strong>{rideDetails.city}</strong></p>
        <p className="mb-2">Distance: <strong>{rideDetails.distance} km</strong></p>
        <p className="mb-4">Price: <strong>{rideDetails.amount} ₹</strong></p> */}

        {/* Status with color */}
        {/* <p className="mb-4">
          Status:{" "}
          <span className={statusColors[rideDetails.status.toLowerCase()]}>
            <strong>{rideDetails.status}</strong>
          </span>
        </p> */}

        
        {/* no use of this code */}
        {/* <div className="flex justify-center">
          {confirm && confirm.status === "ongoing" && (
            <button
              className="px-6 py-2 !bg-yellow-400 text-white rounded-lg transition"
              onClick={() =>
                navigate(`/booking/${confirm.id}`, {
                  state: { rideDetails: confirm },
                })
              }
            >
              Go to your Ride
            </button>
          )}
        </div> */}
      {/* </div> */}
    </div>
  );
}

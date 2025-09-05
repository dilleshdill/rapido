import { useState } from "react";
import PickPoints from "./PickPoints";
import { OSMMap, calculateFare } from "./OSMMap";
import axios from "axios";

export default function BookingPage() {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [fare, setFare] = useState(null);

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
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">Book a Ride</h2>

      <PickPoints setPickup={setPickup} setDrop={setDrop} />
      <OSMMap pickup={pickup} setPickup={setPickup} drop={drop} setDrop={setDrop} />

      <button
        onClick={handleCalculateFare}
        className="bg-yellow-500 text-white py-2 px-4 rounded-lg"
      >
        Estimate Fare
      </button>

      {fare && <p className="text-lg font-bold">Estimated Fare: ₹{fare}</p>}
    </div>
  );
}

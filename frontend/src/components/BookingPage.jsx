import { useState } from "react";
import PickPoints from "./PickPoints";
import OSMMap from "./OSMMap";
import axios from "axios";
import { useLocation } from "react-router-dom";


export default function BookingPage() {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [fare, setFare] = useState(null);
    const location = useLocation();
  const rideDetails = location.state?.rideDetails;
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
        <div className="bg-red-400 w-[50vw]">
            <p>raid Details</p>
            {
                rideDetails.map((item)=>{
                    <div>
                        <p>{item.id}</p>
                        <p>{item.amount}</p>
                    </div>
                })
            }

        </div>
    </div>
  );
}

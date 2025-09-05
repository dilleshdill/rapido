import React, { useState } from "react";
import bike1 from "../assets/bike1.jpg";
import auto from "../assets/auto.jpg";
import cab from "../assets/cab.jpg";
import PickPoints from "../components/PickPoints";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
const vehicles = [
  { id: "bike", label: "Bike", image: bike1,cost:5 },
  { id: "auto", label: "Auto", image: auto,cost:10 },
  { id: "cab", label: "Cab", image: cab,cost:15 },
];

const VehicleSelection = () => {


  const [selected, setSelected] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const navigate = useNavigate();

  const getDistance = (dist) => {
    console.log("Pickup:",dist.pickup);
    console.log("Drop:",dist.drop);
    if (dist.pickup && dist.drop) {
      setPickup(dist.pickup);
      setDrop(dist.drop);
      setDistance(dist.distance);
      setIsShow(true);
      console.log("Distance in vehicle selection:", dist.distance);
    }
    // You can add logic here to calculate distance or fetch route details
  }

  const setIntoBackend = async () => {
    const data = {
      vehicle: selected,
      pickup,
      drop,
      distance,
      price: parseInt(distance.toFixed(2) * vehicles.find(v => v.id === selected).cost) + 5,
      pickupLat: localStorage.getItem("pickup-lat"),
      pickupLon: localStorage.getItem("pickup-lon"),
      dropLat: localStorage.getItem("drop-lat"),
      dropLon: localStorage.getItem("drop-lon"),
    };
    try {
      const response = await axios.post("http://localhost:5000/rides",data,{
        headers: {Authorization: `Bearer ${Cookies.get("userToken")}`,}
      });
      if (response.status === 200) {
        const result = await response.data;
        console.log("Booking successful:", result);
        alert("Booking successful!");
        navigate('/booking-confirmation', { state: { ride: result } });
        // Optionally, redirect or clear selections here
      }
      else {
        console.error("Booking failed:", response.statusText);
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      alert("An error occurred. Please try again.");
    }
  };


  return (
    <div className="flex flex-col w-screen top-0 bg-gray-100 p-0 m-0">
      <PickPoints getRide={getDistance}/>
      
      {isShow && <div className="bg-white mt-5 p-5 rounded-2xl shadow-lg md:w-full w-[350px]">
        <h2 className="text-xl font-semibold mb-6">Select Service</h2>
        <div className="grid gap-4">
          {vehicles.map((v) => (
            <label
              key={v.id}
              className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition 
                ${selected === v.id ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-300 hover:border-blue-400"}`}
              onClick={() => setSelected(v.id)}
            >
              <img src={v.image} alt={v.label} className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-lg font-medium">{v.label}</p>
              </div>
              <div>
                {distance && (
                  <div className={` ${selected === v.id ? "text-sm font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-lg" : ""}`}>
                    {parseInt(distance.toFixed(2) * v.cost)} ₹ -{" "}
                    {parseInt(distance.toFixed(2) * v.cost) + 10} ₹
                  </div>
                )}


              </div>

              <input
                type="radio"
                name="vehicle"
                value={v.id}
                checked={selected === v.id}
                onChange={() => setSelected(v.id)}
                className="accent-blue-500 w-5 h-5"
              />
            </label>
          ))}
        </div>
        <div className="flex justify-center">
          <button
          className="mt-6 w-[90vw] !bg-[#FFCA20] text-black outline-none py-2 rounded-lg hover:!bg-yellow-500 transition"
          disabled={!selected}
          onClick={() => setIntoBackend()}
        >
          Continue Booking
        </button>
        </div>
      </div>}
    </div>
  );
};

export default VehicleSelection;

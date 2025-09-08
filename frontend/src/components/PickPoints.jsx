import React, { useEffect, useState } from "react";
import axios from "axios";
import CostEstimation from "./CostEstimation";

const PickPoints = ({ getRide }) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [dropValue, setDropValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [showEstimation, setShowEstimation] = useState(false);
  const [distance, setDistance] = useState(null);

  // ✅ Load values from localStorage only once
  useEffect(() => {
    const pickup = localStorage.getItem("pickupAddress");
    const drop = localStorage.getItem("dropAddress");

    if (pickup) setSelectedLocation(pickup);
    if (drop) setDropValue(drop);
  }, []);
  // Debounced pickup suggestions
  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedLocation.length >= 3) {
        fetchSuggestions(selectedLocation, setSuggestions);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedLocation]);

  // Debounced drop suggestions
  useEffect(() => {
    const handler = setTimeout(() => {
      if (dropValue.length >= 3) {
        fetchSuggestions(dropValue, setDropSuggestions);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [dropValue]);

  // Fetch suggestions from Nominatim restricted to India
  const fetchSuggestions = async (input, setList) => {
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: input,
          format: "json",
          addressdetails: 1,
          limit: 5,
          countrycodes: "IN",
        },
      });
      setList(response.data || []);
    } catch (err) {
      console.error("Nominatim error:", err);
      setList([]);
    }
  };

  const getEstimation = (dist) => {
    console.log("Distance :", dist);
    setDistance(dist);
  };

  // Render suggestion list
  const renderSuggestions = (list, setValue, setList) => (
    <ul className="border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto bg-white absolute w-full z-10">
      {list.map((s, idx) => (
        <li
          key={idx}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setValue(s.display_name);
            setList([]);
          }}
        >
          {s.display_name}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="w-full bg-gray-100">
      <div className="relative z-10 w-full bg-white rounded-xl p-2 flex flex-col gap-4">
        {/* Pickup */}
        <div className="relative">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3">
            <span className="text-black text-lg">📍</span>
            <input
              type="text"
              value={selectedLocation}
              placeholder="Enter Pickup Location"
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full outline-none text-gray-700"
            />
          </div>
          {suggestions.length > 0 &&
            renderSuggestions(suggestions, setSelectedLocation, setSuggestions)}
        </div>

        {/* Drop */}
        <div className="relative">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3">
            <span className="text-black text-lg">🛑</span>
            <input
              type="text"
              value={dropValue}
              placeholder="Enter Drop Location"
              onChange={(e) => setDropValue(e.target.value)}
              className="w-full outline-none text-gray-700"
            />
          </div>
          {dropSuggestions.length > 0 &&
            renderSuggestions(dropSuggestions, setDropValue, setDropSuggestions)}
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <button
            onClick={() => {
              getRide({ pickup: selectedLocation, drop: dropValue, distance });
              setShowEstimation(!showEstimation);
            }}
            className="mt-4 w-full md:w-1/5 outline-none !bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Book a Ride
          </button>

          {showEstimation && <CostEstimation getCost={getEstimation} />}

          <button
            onClick={() => alert("TODO: implement getLocation")}
            className="mt-4 w-full md:w-1/5 outline-none !bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Use Current Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickPoints;

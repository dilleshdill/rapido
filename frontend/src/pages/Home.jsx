import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const Home = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [dropValue, setDropValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  // Socket for ride success (optional)
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.emit("userId", 203);
    socket.on("rideSuccess", (data) => {
      console.log("🎉 rideSuccess received:", data);
    });
    return () => socket.off("rideSuccess");
  }, []);

  // Debounced pickup suggestions
  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedLocation.length >= 3) fetchSuggestions(selectedLocation, setSuggestions);
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedLocation]);

  // Debounced drop suggestions
  useEffect(() => {
    const handler = setTimeout(() => {
      if (dropValue.length >= 3) fetchSuggestions(dropValue, setDropSuggestions);
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
          countrycodes: "IN"
        }
      });
      setList(response.data || []);
    } catch (err) {
      console.error("Nominatim error:", err);
      setList([]);
    }
  };

  // Convert address to coordinates
  const getCoordinates = async (address) => {
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: address, format: "json", limit: 1, countrycodes: "IN" },
      });
      if (response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon),
        };
      }
      return null;
    } catch (err) {
      console.error("Geocode error:", err);
      return null;
    }
  };

  const getLocationFromUser = async () => {
    const loc1 = await getCoordinates(selectedLocation);    
    const loc2 = await getCoordinates(dropValue);
    console.log(loc1,loc2,selectedLocation,dropValue)
    if (loc1 && loc2) {
      try {
        const res = await axios.post("http://localhost:5000/check/locations", {
          pickup: selectedLocation,
          drop: dropValue,
          loc1,
          loc2
        });
        if (res.status === 200){
          localStorage.setItem("pickup-lat", loc1.lat);
          localStorage.setItem("pickup-lon", loc1.lon);
          localStorage.setItem("drop-lat", loc2.lat);
          localStorage.setItem("drop-lon", loc2.lon);
          localStorage.setItem("pickup-address", selectedLocation);
          localStorage.setItem("drop-address", dropValue);
          navigate("/vehicle-selection");
        } else {
          alert("Failed to save locations");
        }
      } catch (error) {
        console.error("Error saving locations:", error);
      }
    } else {
      alert("Could not find one or both locations. Please enter valid addresses.");
    }
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
    <div className="min-w-screen min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <div className="text-yellow-400 font-bold text-2xl">Rapido</div>
      </header>

      <section className="relative flex flex-col items-center justify-center text-center py-20 bg-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
          Bharat Moves On Rapido!
        </h1>

        <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4">
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

          <button
            onClick={getLocationFromUser}
            className="mt-4 w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Book Ride
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;

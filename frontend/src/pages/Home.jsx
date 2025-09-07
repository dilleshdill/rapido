import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect } from "react";
import { io } from "socket.io-client";


const Home = () => {
  const [selectedLocation, setSelectedLocation] = useState("hyderabad");
  const [dropValue, setDropValue] = useState("hyderabad");
  const [suggestions, setSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [location1, setLocation1] = useState(null);
  const [location2, setLocation2] = useState(null);
  console.log(location1,location2)
  const navigate = useNavigate();


  
useEffect(() => {
  const socket = io("http://localhost:5000");

  socket.emit("userId", 203); // must match DB email

  // socket.on("rideSuccess", (data) => {
  //   console.log("🎉 rideSuccess received:", data);
  // });

  // return () => {
  //   socket.off("rideSuccess");
  // };
}, []); 

  
  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=5`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.features) {
      setSuggestions(data.features);
    } else {
      setSuggestions([]);
    }
  };

  const fetchDropSuggestion = async (input) => {
    if (!input) {
      setDropSuggestions([]);
      return;
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=5`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.features) {
      setDropSuggestions(data.features);
    } else {
      setDropSuggestions([]);
    }
  };

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: address, format: "json", limit: 1 },
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
    if (loc1 && loc2) {
      setLocation1(loc1);
      setLocation2(loc2);
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
  }

  
  return (
    <div className="min-w-screen min-h-screen bg-gray-100">
      
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <div className="text-yellow-400 font-bold text-2xl">rapido</div>
        <div className="flex gap-6 text-gray-700 font-medium">
          <a href="#">About Us</a>
          <a href="#">Rapido Ads</a>
          <a href="#">Safety</a>
          <a href="#">Blog</a>
          <a href="#">Contact Us</a>
        </div>
      </header>

      
      <section className="relative flex flex-col items-center justify-center text-center py-20 bg-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
          Bharat Moves On Rapido!
        </h1>

        
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://maps.gstatic.com/tactile/basepage/pegman_sprites.png"
            alt="map"
            className="w-full h-full object-cover"
          />
        </div>

       
        <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3">
            <span className="text-black text-lg">📍</span>
            <input
              type="text"
              value={selectedLocation}
              placeholder="Enter Pickup Location"
              onChange={(e) =>{
                setSelectedLocation(e.target.value) 
                fetchSuggestions(e.target.value)}}
              className="w-full outline-none text-gray-700"
            />
          </div>
          {suggestions.length > 0 && (
        <ul
          className="border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto bg-white"
        >
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => {
                setSelectedLocation(s?.properties?.name)
                setSuggestions([])
              }
              }
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              <div>
                  <p className="text-lg font-semibold pb-2">{s.properties.city}</p>
                  {s.properties.name}, {s.properties.city || ""} {s.properties.country || ""}
                </div>
            </li>
          ))}
        </ul>
      )}

          <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3">
            <span className="text-black text-lg">🛑</span>
            <input
              type="text"
              value = {dropValue}
              placeholder="Enter Drop Location"
              onChange={(e) => {
                setDropValue(e.target.value)
                fetchDropSuggestion(e.target.value)
              }}
              className="w-full outline-none text-gray-700"
            />
          </div>
            {dropSuggestions.length > 0 && (
        <ul
          className="border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto bg-white"
        >
          {dropSuggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => {
                setDropValue(s?.properties?.name)
                setDropSuggestions([])
              }
              }
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              <div>
                  <p className="text-lg font-semibold pb-2">{s.properties.city}</p>
                  {s.properties.name}, {s.properties.city || ""} {s.properties.country || ""}
                </div>
            </li>
          ))}
        </ul>
      )}
          <button
            onClick={()=>getLocationFromUser()}
            className="mt-4 w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Book Ride
          </button>
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Services</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          We provide safe and fast rides across your city.
        </p>
      </section>
    </div>
  );
};

export default Home;











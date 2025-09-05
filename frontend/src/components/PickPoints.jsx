  import React, { useEffect,useState } from "react";
  import { SignOutButton, useUser } from "@clerk/clerk-react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import CostEstimation from "./CostEstimation";


  const PickPoints = ({getRide}) => {
    const [selectedLocation, setSelectedLocation] = useState("Boppadam");
    const [dropValue, setDropValue] = useState("Ranasthalam");
    const [suggestions, setSuggestions] = useState([]);
    const [dropSuggestions, setDropSuggestions] = useState([]);
    const [showEstimation, setShowEstimation] = useState(false);
    const [distance, setDistance] = useState(null);
  
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

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            setLatAndLong(latitude, longitude);
          },
          (error) => {
            setError(error.message);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    const setLatAndLong = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        console.log(data);
        if (data.address) {
          setStreet(data.address.road || "");
          setSelectedLocation(data.address.road || data.address.town || data.address.village || "");
        }
      } catch (error) {
        setError("Error fetching address");
      }
    };
    
    const getEstimation = (dist) => {
      console.log("Distance :", dist);
      setDistance(dist);
      // You can add logic here to display or use the estimated cost
    }

    

    return (
      <div className="w-full bg-gray-100 ">
      
          <div className="relative z-10 w-full bg-white rounded-xl  p-2 flex flex-col gap-4">
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
                {s.properties.name}, {s.properties.city || ""} {s.properties.country || ""}
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
                {s.properties.name}, {s.properties.city || ""} {s.properties.country || ""}
              </li>
            ))}
          </ul>
        )}
            
          <div className="flex flex-col md:flex-row gap-3 justify-between">
                        <button
              onClick={() => {
                getRide({ pickup: selectedLocation, drop: dropValue ,distance:distance});
                setShowEstimation(!showEstimation);   // show map & distance after clicking
              }}
              className="mt-4 w-full md:w-1/5 outline-none !bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
            >
              Book a Ride
            </button>

              {showEstimation && (
                <CostEstimation
                  getCost={getEstimation}
                  address1={selectedLocation}
                  address2={dropValue}
                />
              )}
            <button
              onClick={getLocation}
              className="mt-4  w-full md:w-1/5 outline-none !bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
            >
              Use Current Location
            </button>
          </div>
          </div>
      
      </div>
    );
  };

  export default PickPoints;











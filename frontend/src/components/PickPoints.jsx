import React, { useEffect,useState } from "react";
import { SignOutButton, useUser } from "@clerk/clerk-react";

import axios from "axios";



const PickPoints = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [dropValue, setDropValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  
  const { user, isSignedIn } = useUser(); 

  useEffect(() => {
    if (isSignedIn && user) {
      fetchData();
    }
  }, [user, isSignedIn]);

  
  const fetchData = async () => {
    const email = user.emailAddresses[0].emailAddress;
    const lastName = user.lastName;
    const firstName = user.firstName;
    try {
      console.log(email, firstName, lastName);
      const response = await axios.post("http://localhost:5000/add", {
        email,
        firstName,
        lastName
      });

      if (response.status === 200){
        console.log("User data added successfully");
      } else {
        console.error("Failed to add user data");
      }
    } catch(error) {
      console.error("Error fetching user data:", error);
    }
  };

  
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

  return (
    <div className="min-w-screen min-h-screen bg-gray-100">
    
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
          <button
            
            className="mt-4 w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Book Ride
          </button>
        </div>
    
    </div>
  );
};

export default PickPoints;











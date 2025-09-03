import React, { useEffect } from "react";
import { SignOutButton, useUser } from "@clerk/clerk-react";

import axios from "axios";



const HomePage = () => {
  
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

  return (
    <div className="min-w-screen min-h-screen bg-gray-100">
      <button className="absolute top-4 right-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition">
        <SignOutButton />
      </button>
      
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
              placeholder="Enter Pickup Location"
              
              className="w-full outline-none text-gray-700"
            />
          </div>

          <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3">
            <span className="text-black text-lg">🛑</span>
            <input
              type="text"
              placeholder="Enter Drop Location"
              
              className="w-full outline-none text-gray-700"
            />
          </div>

          <button
            
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

export default HomePage;

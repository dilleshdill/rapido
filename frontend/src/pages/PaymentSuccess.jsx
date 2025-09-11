import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const PaymentSuccess = () => {
  const [rating, setRating] = useState(0); 
  const navigate = useNavigate()

  const ratingSuccess = () => {
    toast.success("Your Review Submited",{
      position:"top-right",
      autoClose:2000,
      theme:"light"
    })
  }

  const submitRating = async() => {
    try{
      const response = await axios.post("http://localhost:5000/submitRating",
        {
          id : localStorage.getItem("RideId"),
          rating ,
        },
        {
          headers:{
            Authorization:`Bearer ${Cookies.get("userToken")}`
          }
        }
      ) 
      if (response.status === 200){
        navigate("/")
        
      }
    }catch(error){
      console.log("something there is a Error",error)
    }
  }

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FaStar
        key={i}
        size={30}
        className={`cursor-pointer ${
          i <= rating ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={
          () => {
            setRating(i)
            ratingSuccess()
            submitRating()
            
          }
        } 
      />
    );
  }
    
    return (
      <div className="flex items-center w-screen justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-0">
        <div className="w-full max-w-2xl p-8 sm:p-12 text-center transition-all transform bg-white shadow-lg rounded-xl hover:shadow-xl">
   
          <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 bg-green-100 rounded-full">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
  
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-extrabold text-green-600">
            Payment Successful!
          </h1>
  
          <p className="mb-6 sm:mb-8 text-lg sm:text-xl text-gray-700">
            Thank you for your purchase.
          </p>
  
          <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-100 flex flex-col justify-center ">
            <p className="text-xl font-bold sm:text-lg text-gray-700">Rate your Journey</p>
            <div className="flex gap-2 mt-3 justify-center">
              {stars}
              </div>
          </div>
  
          <div className="mt-8 sm:mt-12 flex gap-5 justify-center">
            <div className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-black transition-colors duration-200 !bg-yellow-400 rounded-lg"
            onClick={() => navigate("/")}>
              Go to Home
            </div>
            <div className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-black transition-colors duration-200 !bg-yellow-400 rounded-lg"
              onClick={() => navigate("/all-rides")}>
              Go to All Rides
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default PaymentSuccess;
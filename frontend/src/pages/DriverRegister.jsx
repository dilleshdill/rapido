
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ImageUpload from "../components/ImageUpload";

import rapidoImage2 from "../assets/rapidoImage2.jpg"
import rapidoImage3 from "../assets/rapidoImage3.jpg"
import rapidoImage1 from "../assets/rapidoImage1.webp"   
import { FaUpload } from "react-icons/fa";

const supportedCities = [
  "Bangalore", "Hyderabad", "Chennai", "Pune",
  "Mumbai", "Delhi", "Kolkata", "Jaipur", "Ahmedabad"
];

const RegisterPage = () => {
    const [state,setState] = useState(4)
    const [files, setFiles] = useState("")
    const [files2,setFiles2] = useState("")
    const [files3,setFiles3] = useState("")
    const [files4,setFiles4] = useState("")
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        termsAccepted: false,
        vehicleType: "",
        city: "",
        vehilcleNumber:"",
        drivingLicenceImage1:"",
        drivingLicenceImage2:"",
        vehicleFrontImage:"",
        vehicleBackImage:''
    });

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, 
        autoplaySpeed: 3000,
        arrows: false,
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        
    };

    const images = [
        rapidoImage1,
        rapidoImage2,
        rapidoImage3
    ];

    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");
    const [vehicleType,setVechicleType] = useState("");

    const filteredCities = supportedCities.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    const getImage4 = (data) => {
        console.log(data)
        setFormData({...formData, vehicleBackImage: data[0].url})    
    }

    const getImage3 = (data) => {
        setFormData({...formData, vehicleFrontImage: data[0].url})    
    }
    const getImage2 = (data) => {
        setFormData({...formData, drivingLicenceImage2: data[0].url})    
    }

    const getImage = (data) => {
        setFormData({...formData, drivingLicenceImage1: data[0].url})    
    }

    return (
        <div className="max-h-screen min-w-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[1200px] bg-orange-300 rounded-3xl shadow-2xl flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 rounded-3xl bg-white">
            <Slider {...settings}>
                {images.map((src, index) => (
                <div key={index} className="relative h-[400px] md:h-[600px] w-full">
                    <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full rounded-3xl"
                    />
                    
                </div>
                ))}
            </Slider>
        </div>
            
            <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center">
                {
                    state === 1 && (
                        <div className="max-w-md w-full">
                    <h1 className="text-black text-2xl md:text-4xl font-semibold mb-2">Create an account</h1>
                    <p className="text-gray-400 mb-8">
                    Already have an account?{" "}
                    <a href="https://abhirajk.vercel.app/" className="text-white hover:underline">Log in</a>
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full md:w-1/2 bg-white text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                        />
                        <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full md:w-1/2 bg-white text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                    />

                    <div className="relative">
                        <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-white text-black rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                        />
                        
                        
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        </button>
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Phone Number"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                    />

                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="rounded bg-[#1c1c24] border-gray-600 text-purple-600 focus:ring-purple-600"
                        required
                        />
                        <span className="text-gray-400">I agree to the <a href="#" className="text-white hover:underline">Terms & Conditions</a></span>
                    </label>

                    <button
                        onClick={() => setState(2)}
                        className="w-full bg-purple-600 text-black rounded-lg p-3 hover:bg-purple-700 transition-colors"
                    >
                        Next
                    </button>

                    </form>
                        </div>
                    )
                }
                {
                    state === 2 && (
                       <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                        <h2 className="text-2xl font-semibold text-black">Select your city</h2>

                        <input
                            type="text"
                            placeholder="Search your city"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="p-3  bg-white  text-black border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />

                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                            <option value="">Select a city</option>
                            {filteredCities.map((c, idx) => (
                            <option key={idx} value={c}>
                                {c}
                            </option>
                            ))}
                        </select>

                        <button
                            onClick={() => setState(3)}
                            disabled={!city}
                            className="bg-purple-600 p-3 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                        </div>
                    )
                }
                {
                    state === 3 && (
                        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                        <p className="text-xl font-semibold text-black mb-4">Which type of vehicle do you have</p>

                        <div className="flex flex-col gap-4">
                        
                        <label className="flex items-center justify-between border-2 border-gray-300 rounded-xl p-4 cursor-pointer  hover:bg-purple-100 transition-colors">
                            <span className="text-lg font-medium text-black text-center flex-1">Bike</span>
                            <input 
                            type="radio" 
                            name="vehicle" 
                            value="Bike" 
                            className="h-6 w-6 text-purple-600"
                            onChange={(e)=>setVechicleType(e.target.value)}
                            />
                        </label>


                        <label className="flex items-center justify-between border-2 border-gray-300 rounded-xl p-4 cursor-pointer  hover:bg-purple-100 transition-colors">
                            <span className="text-lg font-medium text-black text-center flex-1">Scooter</span>
                            <input 
                            type="radio" 
                            name="vehicle" 
                            value="Scooter" 
                            className="h-6 w-6 text-purple-600"
                            onChange={(e)=>setVechicleType(e.target.value)}
                            />
                        </label>

    
                        <label className="flex items-center justify-between border-2 border-gray-300 rounded-xl p-4 cursor-pointer  hover:bg-purple-100 transition-colors">
                            <span className="text-lg font-medium text-black text-center flex-1">Car</span>
                            <input 
                            type="radio" 
                            name="vehicle" 
                            value="Car" 
                            className="h-6 w-6 text-purple-600"
                            onChange={(e)=>setVechicleType(e.target.value)}
                            />
                        </label>
                        </div>
                        <div className="flex justify-end">
                            <button 
                        className="bg-purple-600 p-3 rounded disabled:opacity-50 mt-4 w-1/3"

                        onClick={()=>setState(4)}
                        disabled={!vehicleType}>
                            Next
                        </button>
                        </div>
                        </div>


                    )
                }
                {
                    state === 4 && (
                           <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-semibold text-black mb-2">Upload Documents</h2>
                                <p className="text-gray-500 mb-6">
                                    Please upload the necessary documents to proceed.
                                </p>

                                {/* Driver's License Section */}
                                <div>
                                    <label className="block mb-2 text-black font-medium">Driver's License</label>
                                    <div className="flex justify-around gap-4">

                                    {/* Front View */}
                                    {files ? (
                                        <div className="flex flex-col items-center">
                                        <ImageUpload getFunction={getImage} getValue={files} />
                                        <img
                                            src={URL.createObjectURL(files)}
                                            alt="Front Preview"
                                            className="w-40 h-40 object-cover rounded-lg shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFiles(null)}
                                            className="mt-2 text-sm text-red-500 hover:underline"
                                        >
                                            Change
                                        </button>
                                        </div>
                                    ) : (
                                        <label
                                        htmlFor="frontUpload"
                                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-purple-600 hover:bg-purple-50 transition-colors"
                                        >
                                        <FaUpload className="text-gray-400 text-2xl mb-2" />
                                        <span className="text-gray-400">Front View</span>
                                        <input
                                            id="frontUpload"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => setFiles(e.target.files[0])}
                                        />
                                        </label>
                                    )}

                                    {/* Back View */}
                                    {files2 ? (
                                        <div className="flex flex-col items-center">
                                        <ImageUpload getFunction={getImage2} getValue={files2} />
                                        <img
                                            src={URL.createObjectURL(files2)}
                                            alt="Back Preview"
                                            className="w-40 h-40 object-cover rounded-lg shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFiles2(null)}
                                            className="mt-2 text-sm text-red-500 hover:underline"
                                        >
                                            Change
                                        </button>
                                        </div>
                                    ) : (
                                        <label
                                        htmlFor="backUpload"
                                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-purple-600 hover:bg-purple-50 transition-colors"
                                        >
                                        <FaUpload className="text-gray-400 text-2xl mb-2" />
                                        <span className="text-gray-400">Back View</span>
                                        <input
                                            id="backUpload"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => setFiles2(e.target.files[0])}
                                        />
                                        </label>
                                    )}
                                    </div>
                                </div>

                                {/* Licence Number Input */}
                                <label className="block mb-2 text-black font-medium mt-3">
                                    Licence Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Licence Number"
                                    onChange={(e) =>
                                    setFormData({ ...formData, vehicleNumber: e.target.value })
                                    }
                                    className="w-full border border-gray-400 rounded-lg outline-none p-2"
                                />

                                {/* Next Button */}
                                <div className="flex justify-end mt-4">
                                    <button
                                    onClick={() => setState(5)}
                                    className="text-black border-2 border-gray-400 p-2 rounded-lg w-1/3 hover:bg-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                    >
                                    Next
                                    </button>
                                </div>
                                </div>

                    )
                }
                {
                    state === 5 && (
                           <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
  <h2 className="text-2xl font-semibold text-black mb-2">Upload Documents</h2>
  <p className="text-gray-500 mb-6">
    Please upload the necessary documents to proceed.
  </p>

  {/* Vehicle Verification Section */}
  <div>
    <label className="block mb-2 text-black font-medium">
      Vehicle Verification
    </label>

    <div className="grid grid-cols-2 gap-6">
      {/* Vehicle Front View */}
      {files3 ? (
        <div className="flex flex-col items-center">
          <ImageUpload getFunction={getImage3} getValue={files3} />
          <img
            src={URL.createObjectURL(files3)}
            alt="Front Preview"
            className="w-40 h-40 object-cover rounded-lg shadow-md"
          />
          <button
            type="button"
            onClick={() => setFiles3(null)}
            className="mt-2 text-sm text-red-500 hover:underline"
          >
            Change
          </button>
        </div>
      ) : (
        <label
          htmlFor="frontUpload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-purple-600 hover:bg-purple-50 transition-colors"
        >
          <FaUpload className="text-gray-400 text-2xl mb-2" />
          <span className="text-gray-400">Front View</span>
          <input
            id="frontUpload"
            type="file"
            className="hidden"
            onChange={(e) => setFiles3(e.target.files[0])}
          />
        </label>
      )}

      {/* Vehicle Back View */}
      {files4 ? (
        <div className="flex flex-col items-center">
          <ImageUpload getFunction={getImage4} getValue={files4} />
          <img
            src={URL.createObjectURL(files4)}
            alt="Back Preview"
            className="w-40 h-40 object-cover rounded-lg shadow-md"
          />
          <button
            type="button"
            onClick={() => setFiles4(null)}
            className="mt-2 text-sm text-red-500 hover:underline"
          >
            Change
          </button>
        </div>
      ) : (
        <label
          htmlFor="backUpload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-purple-600 hover:bg-purple-50 transition-colors"
        >
          <FaUpload className="text-gray-400 text-2xl mb-2" />
          <span className="text-gray-400">Back View</span>
          <input
            id="backUpload"
            type="file"
            className="hidden"
            onChange={(e) => setFiles4(e.target.files[0])}
          />
        </label>
      )}
    </div>
  </div>

  {/* Vehicle Number Input */}
  <label className="block mb-2 text-black font-medium mt-3">
    Vehicle Number
  </label>
  <input
    type="text"
    placeholder="Enter Vehicle Number"
    className="w-full border border-gray-400 rounded-lg outline-none p-2"
  />

  {/* Register Button */}
  <div className="flex justify-end mt-4">
    <button
      onClick={() => setState(5)}
      className="text-black border-2 border-gray-400 p-2 rounded-lg w-1/3 hover:bg-gray-400 hover:text-white transition-colors disabled:opacity-50"
    >
      Register
    </button>
  </div>
</div>

                    )
                }
            </div>

            </div>
        </div>
    );
};

export default RegisterPage;
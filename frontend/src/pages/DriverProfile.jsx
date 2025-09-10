import React from "react";
import { Link } from "react-router-dom";
import { useEffect  } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const DriverProfile = () => {
    const [driverData,setDriverData] = useState({})
    const showError = () =>{
        toast.error("Data Not Fetching",{
            position:'top-right',
            autoClose:3000,
            theme:"light"
        })
    }

    useEffect(() => {
        fetchedData()
    },[])

    const fetchedData = async() =>{
        try{
            const responses = await axios.get('http://localhost:5000/driver/getDriverDetailes', {
                headers: {
                    Authorization: `Bearer ${Cookies.get("authToken")}`,
                },
            })
            console.log("driver fetched Detailes",response.data.data)
            if (responses.status === 200){
                setDriverData(response.data.data)
            }
        }catch(error){
            showError()
            console.log("data not fetching")
        }
    } 

    return (
        <div className="min-h-screen min-w-screen bg-gray-100 p-4 sm:p-8">
        {/* Navbar */}
        <nav className="bg-white shadow-md px-6 py-5 flex justify-between items-center rounded-2xl">
            <Link to="/driver-home">
                <p className="text-xl font-bold text-yellow-400">Driver Dashboard</p>
            </Link>
            <div className="flex gap-6">
            <Link
                to="/driver-rides"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
                Driver Rides
            </Link>
            <Link
                to="/driver-profile"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
                Profile
            </Link>
            </div>
        </nav>

        {/* Driver Info */}
        <div className="bg-yellow-400 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden mt-6">
            <img
            src={driver.photo}
            alt={driver.name}
            className="w-32 h-32 rounded-full border-4 border-white mx-auto shadow-lg object-cover"
            />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{driver.name}</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-yellow-700 text-lg">⭐</span>
            <span className="font-semibold">{driver.rating} / 5</span>
            </div>
            <p className="mt-2 text-gray-800 font-medium">{driver.vehicle}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatCard label="Trips Completed" value={driver.trips} emoji="🚗" />
            <StatCard label="Experience" value={`${driver.experience} yrs`} emoji="⏱️" />
            <StatCard label="Plate No" value={driver.plate} emoji="🔖" />
            <StatCard label="Rating" value={driver.rating} emoji="🌟" />
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Info</h2>
            <ContactItem label="Phone" value={driver.phone} emoji="📞" />
            <ContactItem label="Email" value={driver.email} emoji="✉️" />
            <ContactItem label="Location" value={driver.location} emoji="📍" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-2xl shadow-md transition">
            Call Driver
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-2xl shadow-md transition">
            Message Driver
            </button>
        </div>
        </div>
    );
};

const StatCard = ({ label, value, emoji }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center hover:shadow-lg transition">
    <span className="text-2xl">{emoji}</span>
    <p className="text-gray-500 text-sm mt-1">{label}</p>
    <p className="text-gray-900 font-semibold mt-1">{value}</p>
  </div>
);

const ContactItem = ({ label, value, emoji }) => (
  <div className="flex items-center gap-4 border-b border-gray-200 py-2">
    <span className="text-lg">{emoji}</span>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

export default DriverProfile;

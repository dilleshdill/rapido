import React from "react";
import { Link } from "react-router-dom";
import { useEffect,useState  } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { useRef } from "react";
import ImageUpload from "../components/ImageUpload";

const UserProfile = () => {
  
  const [driverData,setDriverData] = useState({})
  const fileUploadRef = useRef(null)
  const [files,setFiles] = useState(null)
  const [imageUrl,setImageUrl] = useState(null)

  const showError = () => {
    toast.error("Data Not Fetching",{
        position:"top-right",
        autoClose:3000,
        theme:'light'
    })
  }

  const getImage = (data) => {
    console.log("image data",data)
    setImageUrl(data[0].url)
    console.log(data[0].url)
    fetchedData()
  }

   const fetchedData = async () => {
    try {
      const token = Cookies.get("userToken");
      
      const response = await axios.get(
        "http://localhost:5000/userDetailes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Driver fetched details:", response.data.data);
      if (response.status === 200) {
        setDriverData(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch driver details"); 
      console.error("Error fetching driver details:", error.message);
    }
  };

  useEffect(() => {
    fetchedData();
  }, []);

  const getHandle = () => {
    fileUploadRef.current.click()
  }

  const getImageHandle = (event) => {
    const file = event.target.files[0]

    if(file){
        setFiles(file)
    }
  }


  return (
    <div className="min-h-screen min-w-screen bg-gray-100 p-4 sm:p-8">
      
      <nav className="bg-white shadow-md px-6 py-5 flex justify-between items-center rounded-2xl">
        <Link to="/">
            <p className="text-xl font-bold text-yellow-400">User Rapido</p>
        </Link>
        <div className="flex gap-6">
          <Link
            to="/all-rides"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Rides
          </Link>
          <Link
            to="/user-profile"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Profile
          </Link>
        </div>
      </nav>
      
      <div className="bg-yellow-400 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden mt-6">
        <img
          src={driverData.driver_image_url}
          alt={driverData.fullname}
          className="w-32 h-32 rounded-full border-4 border-white mx-auto shadow-lg object-cover"
          onClick={() => {getHandle()}}
        />
        <input 
        type="file"
        ref={fileUploadRef}
        className="hidden"
        onChange={getImageHandle}   
        />
        {
          files && <ImageUpload getFunction={getImage} getValue={files} />
        }
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{driverData.firstname}  {driverData.lastname} </h1>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Info</h2>
        <ContactItem label="Email" value={driverData.email} emoji="✉️" />
      </div>
    </div>
  );
};  

const ContactItem = ({ label, value, emoji }) => (
  <div className="flex items-center gap-4 border-b border-gray-200 py-2">
    <span className="text-lg">{emoji}</span>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

export default UserProfile;

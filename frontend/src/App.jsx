
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUpPage from './pages/SignUpPage';
import Home from './pages/Home';
import "./App.css"
import DriverRegister from './pages/DriverRegister';
import ImageUpload from './components/ImageUpload';
import VehicleSelection from './pages/VehicleSelection';
import OSMMap from './components/OSMMap';
import DriverLogin from './pages/DriverLogin';
import BookingConfirmation from './pages/BookingConfirmation';
import AllRides from './pages/AllRides';
import  DriverHome  from './pages/DriverHome';
import BookingPage from './components/BookingPage';
import PickupToDestination from './components/PickupToDestination'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess';
import DriverRides from './pages/DriverRides';
import DriverProfile from './pages/DriverProfile';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return(
    <BrowserRouter>
     <ToastContainer />
      <Routes> 
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/upload" element={<ImageUpload />} />
        <Route exact path="/driver-register" element={<DriverRegister />} />
        <Route exact path="/vehicle-selection" element={<VehicleSelection />} />
        <Route exact path="/map" element={<OSMMap />} />
        <Route exact path="/driver-login" element={<DriverLogin />} />
        <Route exact path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route exact path="/all-rides" element={<AllRides />} />
        <Route exact path="/driver-home" element={<DriverHome />} />
        <Route exact path="/booking-ride/:id" element={<BookingPage />} />
        <Route exact path="/wayto-destination" element={<PickupToDestination />} />
        <Route exact path="/payment-page" element={<Payment />} />
        <Route exact path="/payment-success" element={<PaymentSuccess />} />
        <Route exact path="/driver-rides" element={<DriverRides />} />
        <Route exact path="/driver-profile" element = {<DriverProfile />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App

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
import { DriverHome } from './pages/DriverHome';
import BookingPage from './components/BookingPage';


const App = () => {
  return(
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
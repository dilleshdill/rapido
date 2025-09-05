
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import SignUpPage from './pages/SignUpPage';
import Home from './pages/Home';
import "./App.css"
import DriverRegister from './pages/DriverRegister';
import ImageUpload from './components/ImageUpload';
import VehicleSelection from './pages/VehicleSelection';
import OSMMap from './components/OSMMap';
import DriverLogin from './pages/DriverLogin';
import BookingConfirmation from './pages/BookingConfirmation';


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
      </Routes>
    </BrowserRouter>
  )
}

export default App
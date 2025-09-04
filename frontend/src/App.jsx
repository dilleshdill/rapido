
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import SignUpPage from './pages/SignUpPage';
import Home from './pages/Home';
import "./App.css"
import DriverRegister from './pages/DriverRegister';
import ImageUpload from './components/ImageUpload';
import VehicleSelection from './pages/VehicleSelection';

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
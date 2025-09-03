
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import SignUpPage from './pages/SignUpPage';
import Home from './pages/Home';
import "./App.css"
import DriverRegister from './pages/DriverRegister';
import ImageUpload from './components/ImageUpload';


const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/upload" element={<ImageUpload />} />
        <Route exact path="/driver-register" element={<DriverRegister />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
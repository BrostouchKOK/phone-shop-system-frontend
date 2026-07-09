import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast'
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from './pages/Register'
import VerifyOTP from "./pages/VerifyOTP";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-customBg text-primary">
        {/* កន្លែងនេះបន្តិចទៀតយើងនឹងដាក់ <Navbar /> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // 👈 ថែម Toast
import { verifyOtp } from "../api/authApi";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("temp_email");
    if (!savedEmail) {
      navigate("/login");
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await verifyOtp({ otp });

      if (response.data.success) {
        toast.success("ផ្ទៀងផ្ទាត់ជោគជ័យ! សូមស្វាគមន៍មកកាន់ហាងយើងខ្ញុំ។");
        localStorage.setItem("token", response.data.token);
        localStorage.removeItem("temp_email");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      setLoading(false);
      toast.error(
        err.response?.data?.message || "លេខកូដ OTP មិនត្រឹមត្រូវ ឬហួសកំណត់!",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl shadow-purple-100/40 border border-gray-100 w-full sm:max-w-md text-center transition-all duration-300">
        <div className="mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-100">
            <span className="text-xl sm:text-2xl">🔒</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
            ផ្ទៀងផ្ទាត់លេខកូដ OTP
          </h2>
          <p className="text-gray-400 mt-2 text-xs sm:text-sm px-1 break-all">
            លេខកូដ ៦ ខ្ទង់ត្រូវបានផ្ញើទៅកាន់ <br />
            <span className="text-accent font-medium">{email}</span> រួចហើយ។
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 sm:space-y-5">
          <div>
            <input
              type="text"
              required
              maxLength="6"
              className="w-full text-center px-4 py-3 bg-customBg border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition font-bold text-xl sm:text-2xl tracking-[6px] sm:tracking-[10px]"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition duration-200 hover:bg-opacity-90 shadow-lg shadow-purple-200 disabled:bg-gray-300 disabled:shadow-none text-sm sm:text-base cursor-pointer"
          >
            {loading ? "កំពុងផ្ទៀងផ្ទាត់..." : "ផ្ទៀងផ្ទាត់ និងបន្ត"}
          </button>
        </form>
      </div>
    </div>
  );
}

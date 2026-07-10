import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // 👈 ថែម Toast
import { loginUser } from "../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 💡 ប្រើប្រាស់ toast.promise ដើម្បីបង្ហាញ Loading, Success, Error ក្នុងប៊ូតុងតែមួយ
    const loginPromise = loginUser({ email, password });

    toast.promise(loginPromise, {
      loading: "កំពុងផ្ទៀងផ្ទាត់គណនី...",
      success: (res) => {
        localStorage.setItem("temp_email", email);
        navigate("/verify-otp");
        return "លេខកូដ OTP ត្រូវបានផ្ញើទៅ Email រួចរាល់!";
      },
      error: (err) => {
        setLoading(false);
        return (
          err.response?.data?.message ||
          "Email ឬ លេខកូដសម្ងាត់មិនត្រឹមត្រូវឡើយ!"
        );
      },
    });

    try {
      await loginPromise;
    } catch (err) {
      // ប្រព័ន្ធ toast ចាប់យក error រួចហើយ
    } finally {
      setLoading(false);
    }
  };

  return (
    // 📱 Responsive Container: ហូតពង្រីកពេញអេក្រង់ និងដកឃ្លាខ្លះៗលើ Mobile (p-4)
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/*  Card Responsive: លាតពេញលើទូរស័ព្ទ (w-full) តែរួមតូចត្រឹមល្មមលើ Laptop/Desktop (sm:max-w-md) */}
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl shadow-purple-100/40 border border-gray-100 w-full sm:max-w-md transition-all duration-300">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Login ចូលប្រព័ន្ធ
          </h2>
          <p className="text-gray-400 mt-2 text-xs sm:text-sm">
            សូមបញ្ចូលគណនីរបស់អ្នកដើម្បីបន្តទៅកាន់ហាង Gadget
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              អាសយដ្ឋាន Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 sm:py-3 bg-customBg border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition text-sm sm:text-base font-medium"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              លេខកូដសម្ងាត់ (Password)
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 sm:py-3 bg-customBg border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition text-sm sm:text-base font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition duration-200 hover:bg-opacity-90 shadow-lg shadow-purple-200 disabled:bg-gray-300 disabled:shadow-none text-sm sm:text-base cursor-pointer"
          >
            {loading ? "កំពុងដំណើរការ..." : "ចូលប្រព័ន្ធ"}
          </button>
        </form>

        <div className="text-center mt-6 text-xs sm:text-sm text-gray-500">
          មិនទាន់មានគណនីមែនទេ?{" "}
          <Link
            to="/register"
            className="text-accent font-semibold hover:underline"
          >
            ចុះឈ្មោះនៅទីនេះ
          </Link>
        </div>
      </div>
    </div>
  );
}

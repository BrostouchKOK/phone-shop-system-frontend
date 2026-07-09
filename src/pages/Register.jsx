import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { registerUser } from "../api/authApi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await registerUser({ name, email, password });

      if (response.data.success) {
        toast.success("ចុះឈ្មោះគណនីជោគជ័យ! សូមចូលប្រព័ន្ធដើម្បីទទួលលេខ OTP។");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setLoading(false);
      toast.error(
        err.response?.data?.message ||
          "មានបញ្ហាក្នុងការចុះឈ្មោះ! ប្រហែលជា Email នេះមានគេប្រើរួចហើយ។",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl shadow-purple-100/40 border border-gray-100 w-full sm:max-w-md transition-all duration-300">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            ចុះឈ្មោះសមាជិក
          </h2>
          <p className="text-gray-400 mt-2 text-xs sm:text-sm">
            បង្កើតគណនីថ្មីរបស់អ្នកដើម្បីចាប់ផ្តើមទិញទំនិញ
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              ឈ្មោះរបស់អ្នក
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 sm:py-3 bg-customBg border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition text-sm sm:text-base font-medium"
              placeholder="Jonh Deo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              minLength="6"
              className="w-full px-4 py-2.5 sm:py-3 bg-customBg border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition text-sm sm:text-base font-medium"
              placeholder="•••••••• (យ៉ាងហោចណាស់ ៦ ខ្ទង់)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition duration-200 hover:bg-opacity-90 shadow-lg shadow-purple-200 disabled:bg-gray-300 disabled:shadow-none text-sm sm:text-base cursor-pointer"
          >
            {loading ? "កំពុងបង្កើតគណនី..." : "បង្កើតគណនីថ្មី"}
          </button>
        </form>

        <div className="text-center mt-6 text-xs sm:text-sm text-gray-500">
          មានគណនីរួចហើយមែនទេ?{" "}
          <Link
            to="/login"
            className="text-accent font-semibold hover:underline"
          >
            ចូលគណនី
          </Link>
        </div>
      </div>
    </div>
  );
}

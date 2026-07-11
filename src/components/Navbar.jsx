import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🛠️ ដំណោះស្រាយ៖ ទាញយកទិន្នន័យ User ពី localStorage (បើគ្មានទេ ឱ្យវាទៅជា Object ទទេ)
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // សម្អាតទិន្នន័យ user ចោលពេលចាកចេញ
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-black text-primary tracking-tight"
          >
            IT3<span className="text-accent">.TECH</span>
          </Link>

          {/* ========================================================= */}
          {/* 🖥️ DESKTOP MENU                                           */}
          {/* ========================================================= */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-sm">
            <Link to="/" className="hover:text-accent transition">
              ទំព័រដើម
            </Link>

            {/* 🛒 កន្ត្រកទំនិញ (Desktop) - បង្ហាញតែចំពោះ User ធម្មតាប៉ុណ្ណោះ */}
            {user.role !== "admin" && (
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 hover:text-accent transition py-2"
              >
                <div className="relative flex items-center justify-center">
                  <FiShoppingCart className="text-xl text-gray-600 hover:text-accent" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span>កន្ត្រកទំនិញ</span>
              </Link>
            )}

            {token ? (
              <div className="flex items-center gap-4">
                {/* 👑 ប៊ូតុងសម្រាប់ ADMIN (Desktop) */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/orders"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100 hover:bg-rose-600 hover:text-white transition duration-200 cursor-pointer animate-pulse"
                  >
                    <FiSettings
                      className="text-sm animate-spin"
                      style={{ animationDuration: "3s" }}
                    />
                    គ្រប់គ្រងប្រព័ន្ធ (Admin)
                  </Link>
                )}

                {/* 🪪 ប៊ូតុងប្រវត្តិរូប */}
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-accent rounded-xl text-xs font-bold border border-purple-100 hover:bg-accent hover:text-white transition duration-200 cursor-pointer"
                >
                  <FiUser className="text-sm" />
                  ប្រវត្តិរូប
                </Link>

                {/* 🚪 ប៊ូតុងចាកចេញ */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 cursor-pointer transition"
                  title="ចាកចេញ"
                >
                  <FiLogOut className="text-lg" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-accent transition"
              >
                ចូលប្រើប្រាស់
              </Link>
            )}
          </div>

          {/* ========================================================= */}
          {/* 📱 MOBILE MENU BUTTON                                     */}
          {/* ========================================================= */}
          <div className="md:hidden flex items-center gap-4">
            {/* បង្ហាញកន្ត្រកទំនិញលើ Mobile តែករណីមិនមែនជា Admin ប៉ុណ្ណោះ */}
            {user.role !== "admin" && (
              <Link to="/cart" className="relative p-2 text-primary">
                <FiShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary focus:outline-none text-xl cursor-pointer"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 📱 MOBILE DROPPED MENU                                    */}
      {/* ========================================================= */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 px-4 pt-2 pb-4 space-y-3 font-medium text-sm shadow-lg rounded-b-xl">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 hover:text-accent"
          >
            ទំព័រដើម
          </Link>

          {user.role !== "admin" && (
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between py-2 hover:text-accent"
            >
              <div className="flex items-center gap-2">
                <FiShoppingCart className="text-base" /> កន្ត្រកទំនិញ
              </div>
              {totalItems > 0 && (
                <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems} គ្រឿង
                </span>
              )}
            </Link>
          )}

          {token ? (
            <div className="flex flex-col gap-3 pt-2 border-t border-gray-50">
              {/* 👑 ប៊ូតុងសម្រាប់ ADMIN (Mobile) */}
              {user.role === "admin" && (
                <Link
                  to="/admin/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100"
                >
                  <FiSettings className="text-sm" />
                  គ្រប់គ្រងប្រព័ន្ធ (Admin)
                </Link>
              )}

              {/* 🪪 ប៊ូតុងប្រវត្តិរូប (Mobile) */}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-purple-50 text-accent rounded-xl text-xs font-bold border border-purple-100"
              >
                <FiUser className="text-sm" />
                ប្រវត្តិរូបរបស់ខ្ញុំ
              </Link>

              {/* 🚪 ប៊ូតុងចាកចេញ (Mobile) */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-gray-50 text-red-500 rounded-xl text-xs font-bold border border-gray-100"
              >
                <FiLogOut className="text-sm" />
                ចាកចេញពីប្រព័ន្ធ
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold"
            >
              ចូលប្រើប្រាស់
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// 👈 Import Icons ស្អាតៗមកប្រើប្រាស់
import { FiShoppingCart, FiLogOut, FiLogIn, FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-sm">
            <Link to="/" className="hover:text-accent transition">
              ទំព័រដើម
            </Link>

            {/* 🛒 ប្តូរមកប្រើ FiShoppingCart Icon */}
            <Link
              to="/cart"
              className="flex items-center gap-1.5 hover:text-accent transition"
            >
              <FiShoppingCart className="text-lg text-gray-600 hover:text-accent" />
              <span>កន្ត្រកទំនិញ</span>
            </Link>

            {token ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-primary text-white text-xs px-4 py-2 rounded-xl hover:bg-opacity-90 transition cursor-pointer"
              >
                <FiLogOut /> ចាកចេញ
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-accent text-white text-xs px-4 py-2 rounded-xl hover:bg-opacity-90 transition shadow-md shadow-purple-100"
              >
                <FiLogIn /> ចូលប្រព័ន្ធ
              </Link>
            )}
          </div>

          {/* Mobile Menu Button (FiMenu / FiX) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary focus:outline-none text-xl cursor-pointer"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropped Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 px-4 pt-2 pb-4 space-y-3 font-medium text-sm shadow-lg rounded-b-xl">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 hover:text-accent"
          >
            ទំព័រដើម
          </Link>

          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 py-2 hover:text-accent"
          >
            <FiShoppingCart className="text-base" /> កន្ត្រកទំនិញ
          </Link>

          {token ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 rounded-xl text-xs"
            >
              <FiLogOut /> ចាកចេញ
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 bg-accent text-white py-2.5 rounded-xl text-xs"
            >
              <FiLogIn /> ចូលប្រព័ន្ធ
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

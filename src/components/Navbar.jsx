import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiLogOut, FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext"; // 👈 ១. Import useCart ចូលមក

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart(); // 👈 ២. ទាញយក totalItems មកប្រើប្រាស់

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
            SEYHA<span className="text-accent">.TECH</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-sm">
            <Link to="/" className="hover:text-accent transition">
              ទំព័រដើម
            </Link>

            {/* 🛒 កន្ត្រកទំនិញ (Desktop) ថែម Badge លេខ */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 hover:text-accent transition py-2"
            >
              <div className="relative flex items-center justify-center">
                <FiShoppingCart className="text-xl text-gray-600 hover:text-accent" />
                {/* 💡 បើមានទំនិញ > 0 ទើបបង្ហាញ Badge ពណ៌ស្វាយលោតត្រដែតខាងលើ */}
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {totalItems}
                  </span>
                )}
              </div>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* 🛒 កន្ត្រកទំនិញ (Mobile) បង្ហាញនៅខាងក្រៅម៉ឺនុយ ក្បែរប៊ូតុង Menu តែម្តងដើម្បីឱ្យ User ងាយមើលឃើញ */}
            <Link to="/cart" className="relative p-2 text-primary">
              <FiShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

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

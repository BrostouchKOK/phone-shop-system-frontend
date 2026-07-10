import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiPackage,
  FiSmartphone,
  FiUsers,
  FiTrendingUp,
  FiHome,
} from "react-icons/fi";

const AdminSidebar = () => {
  const location = useLocation();

  // បញ្ជីទំព័រផ្សេងៗរបស់ Admin (អក្សរធំ និងច្បាស់)
  const menuItems = [
    { path: "/admin/orders", name: "វិក្កយបត្រ", icon: <FiPackage /> },
    { path: "/admin/products", name: "ផលិតផល", icon: <FiSmartphone /> },
    { path: "/admin/users", name: "សមាជិក", icon: <FiUsers /> },
    { path: "/admin/dashboard", name: "ចំណូល", icon: <FiTrendingUp /> },
    { path: "/admin/dashboard", name: "ចំណូល", icon: <FiTrendingUp /> },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 🖥️ SIDEBAR សម្រាប់ DESKTOP (អេក្រង់ធំ)                          */}
      {/* ========================================================= */}
      <div className="w-64 bg-white min-h-[calc(100vh-4rem)] border-r border-gray-100 p-4 space-y-3 hidden md:block shrink-0">
        {/* ពង្រីកអក្សរចំណងជើងម៉ឺនុយទៅ text-xs (ពីមុន text-[11px]) */}
        <div className="px-3 py-2 text-lg font-black text-gray-400 uppercase tracking-wider">
          ម៉ឺនុយគ្រប់គ្រង
        </div>
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition duration-200 ${
                  isActive
                    ? "bg-rose-50 text-rose-600 border border-rose-100 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                }`}
              >
                {/* ពង្រីក Icon ទៅ text-base */}
                <span className="text-base">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="pt-4 border-t border-gray-100 w-full">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 rounded-xl text-sm font-bold transition duration-200 border border-gray-100 shadow-sm"
          >
            <span className="text-base">
              <FiHome />
            </span>
            ទៅកាន់ទំព័រហាង
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 📱 BOTTOM NAV សម្រាប់ MOBILE (ទូរស័ព្ទដៃ)                       */}
      {/* ========================================================= */}
      {/* 🛠️ បង្កើនកម្ពស់របារខាងក្រោមទៅ h-20 (ពីមុន h-16) ដើម្បីឱ្យប៊ូតុងធំស្រួលចុច */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-50 flex justify-around items-center h-20 px-2 rounded-t-2xl">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 text-center transition ${
                isActive ? "text-rose-600 font-black" : "text-gray-400"
              }`}
            >
              {/* 🛠️ ពង្រីកទំហំ Icon លើទូរស័ព្ទទៅ text-xl (ពីមុន text-lg) */}
              <span className="text-xl mb-1">{item.icon}</span>
              {/* 🛠️ ពង្រីកទំហំអក្សរម៉ឺនុយលើទូរស័ព្ទទៅ text-xs (ពីមុន text-[10px]) */}
              <span className="text-xs tracking-tight font-bold">
                {item.name}
              </span>
            </Link>
          );
        })}

        <Link
          to="/"
          className="flex flex-col items-center justify-center flex-1 py-2 text-center text-blue-600 font-bold border-l border-gray-50"
        >
          <span className="text-xl mb-1">
            <FiHome />
          </span>
          <span className="text-xs tracking-tight">ទៅហាង</span>
        </Link>
      </div>
    </>
  );
};

export default AdminSidebar;

import React, { useEffect, useState } from "react";
import { apiGetDashboardStats } from "../../api/orderApi";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiGetDashboardStats();

        // 💡 ចាប់យក response.data ដោយផ្ទាល់ពី Axios
        if (response && response.data) {
          const resData = response.data;

          if (resData.success) {
            setStats(
              resData.stats || {
                totalRevenue: 0,
                totalOrders: 0,
                totalProducts: 0,
                totalUsers: 0,
              },
            );
            setChartData(resData.monthlyAnalytics || []);
            setRecentOrders(resData.recentOrders || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-customBg">
        <div className="text-center py-20 text-gray-500 animate-pulse text-base font-medium">
          កំពុងផ្ទុកទិន្នន័យស្ថិតិ Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-customBg flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary">
            ផ្ទាំងគ្រប់គ្រងទូទៅ
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            ពិនិត្យមើលស្ថានភាពលក់ និងស្ថិតិចំណូល
          </p>
        </div>

        {/* 📊 Cards ស្ថិតិ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase">
                ចំណូលសរុប
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-600">
                ${(stats.totalRevenue || 0).toLocaleString()}
              </h2>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600 text-xl sm:text-2xl">
              <FiDollarSign />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase">
                ការកម្ម៉ង់សរុប
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-600">
                {stats.totalOrders || 0} វិក្កយបត្រ
              </h2>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl text-blue-600 text-xl sm:text-2xl">
              <FiCheckCircle />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase">
                ផលិតផលក្នុងហាង
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-600">
                {stats.totalProducts || 0} មុខ
              </h2>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl text-amber-600 text-xl sm:text-2xl">
              <FiShoppingBag />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase">
                អតិថិជនសរុប
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-indigo-600">
                {stats.totalUsers || 0} នាក់
              </h2>
            </div>
            <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600 text-xl sm:text-2xl">
              <FiUsers />
            </div>
          </div>
        </div>

        {/* 📉 Grid ក្រាហ្វិក និងតារាង */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
            <h3 className="text-base sm:text-lg font-black text-primary mb-4">
              តារាងវិភាគចំណូលប្រចាំឆ្នាំ ($)
            </h3>
            <div className="h-72 sm:h-80 w-full text-xs sm:text-sm">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  // ១. ប្តូរ margin left ពី -20 មកជា 0 ឬ 5 វិញ ដើម្បីកុំឱ្យដាច់លេខ
                  margin={{ top: 10, right: 10, left: 5, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} />

                  {/* ២. បន្ថែម width={50} ឬ width={60} ទៅលើ YAxis ដើម្បីទុកកន្លែងឱ្យលេខវែងៗបង្ហាញបានគ្រប់គ្រាន់ */}
                  <YAxis stroke="#9ca3af" tickLine={false} width={50} />

                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "ចំណូល",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="ចំណូល"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-primary mb-4">
                ការបញ្ជាទិញថ្មីៗ
              </h3>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate max-w-[120px]">
                        {order.user?.name || "អតិថិជនទូទៅ"}
                      </h4>
                      <p className="text-[10px] font-mono text-gray-400">
                        ID: #
                        {order._id
                          ? order._id
                              .substring(order._id.length - 6)
                              .toUpperCase()
                          : ""}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs sm:text-sm font-black text-primary">
                        ${order.totalPrice}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-600"
                            : order.status === "Pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-center text-xs sm:text-sm text-gray-400 py-10">
                    មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

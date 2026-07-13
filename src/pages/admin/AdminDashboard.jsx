import React, { useEffect, useState } from "react";
import { apiGetDashboardStats } from "../../api/orderApi";
// 🌟 ប្រើប្រាស់ API ពិតប្រាកដរបស់បង និងប្តូរ Path ឱ្យត្រូវតាមទីតាំងហ្វាយជាក់ស្តែង (ឧទាហរណ៍៖ ../../api/productApi)
import { getAllProducts } from "../../api/productApi";
import { Link } from "react-router-dom";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiCheckCircle,
  FiArrowRight,
  FiAlertTriangle,
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
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [timeRange, setTimeRange] = useState("year");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // ១. ទាញទិន្នន័យស្ថិតិទូទៅពី Backend
        const statsResponse = await apiGetDashboardStats(timeRange);

        // ២. ហៅប្រើប្រាស់ API របស់បង
        let allProducts = [];
        try {
          const productsResponse = await getAllProducts();

          if (
            productsResponse &&
            productsResponse.data &&
            Array.isArray(productsResponse.data.data)
          ) {
            allProducts = productsResponse.data.data;
          }
        } catch (pError) {
          console.error(
            "Failed to fetch products for low stock alert:",
            pError,
          );
        }

        if (statsResponse && statsResponse.data) {
          const resData = statsResponse.data;
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

            // 🌟 ចម្រោះយកផលិតផលណាដែលមាន stock <= 5
            const filteredLowStock = allProducts.filter(
              (product) =>
                product.stock !== undefined && Number(product.stock) <= 5,
            );

            setLowStockProducts(filteredLowStock);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

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
        {/* 📋 Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary">
              ផ្ទាំងគ្រប់គ្រងទូទៅ
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              ពិនិត្យមើលស្ថានភាពលក់ និងស្ថិតិចំណូល
            </p>
          </div>

          {/* 📅 Dropdown ជ្រើសរើសចន្លោះពេល */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">
              បង្ហាញតាម៖
            </span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-gray-200 text-primary text-xs sm:text-sm font-bold rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="week">៧ ថ្ងៃចុងក្រោយ</option>
              <option value="month">ខែនេះ</option>
              <option value="year">ឆ្នាំនេះ</option>
            </select>
          </div>
        </div>

        {/* 📊 Cards ស្ថិតិ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* កាតចំណូល */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase">
                ចំណូលសរុប (
                {timeRange === "week"
                  ? "សប្តាហ៍"
                  : timeRange === "month"
                    ? "ខែ"
                    : "ឆ្នាំ"}
                នេះ)
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-600">
                ${(stats.totalRevenue || 0).toLocaleString()}
              </h2>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600 text-xl sm:text-2xl">
              <FiDollarSign />
            </div>
          </div>

          {/* កាតការកម្ម៉ង់ */}
          <Link
            to="/admin/orders"
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition"
          >
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
          </Link>

          {/* កាតផលិតផល */}
          <Link
            to="/admin/products"
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition"
          >
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
          </Link>

          {/* កាតអតិថិជន */}
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
          {/* តារាងក្រាហ្វិក */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
            <h3 className="text-base sm:text-lg font-black text-primary mb-4">
              តារាងវិភាគចំណូល ($)
            </h3>
            <div className="h-72 sm:h-80 w-full text-xs sm:text-sm">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
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
                  <YAxis stroke="#9ca3af" tickLine={false} width={50} />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "ចំណូលសរុប",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* កន្លែងបញ្ជាទិញថ្មីៗ */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-black text-primary">
                  ការបញ្ជាទិញថ្មីៗ
                </h3>
                <Link
                  to="/admin/orders"
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                >
                  មើលទាំងអស់ <FiArrowRight />
                </Link>
              </div>

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

        {/* 🚨 ផ្នែកបង្ហាញទំនិញជិតអស់ពីស្តុក (Low Stock Alert) */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-50 text-red-500 rounded-lg text-lg">
                <FiAlertTriangle />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-primary">
                  ទំនិញជិតអស់ពីស្តុក (សល់តិចជាង ៥ គ្រឿង)
                </h3>
                <p className="text-[11px] text-gray-400">
                  សូមពិនិត្យ និងបំពេញស្តុកបន្ថែមដើម្បីកុំឱ្យដាច់ការលក់
                </p>
              </div>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              គ្រប់គ្រងស្តុក <FiArrowRight />
            </Link>
          </div>

          {/* បញ្ជីទំនិញស្តុកទាប */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 bg-red-50/30 border border-red-100 rounded-xl"
              >
                <div className="space-y-0.5 truncate pr-2">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    ម៉ាក៖ {product.brand || "ទូទៅ"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2 py-1 text-xs font-black bg-red-100 text-red-600 rounded-lg">
                    សល់ {product.stock} គ្រឿង
                  </span>
                </div>
              </div>
            ))}

            {lowStockProducts.length === 0 && (
              <div className="col-span-full text-center text-xs sm:text-sm text-gray-400 py-6 bg-emerald-50/20 border border-emerald-100/60 rounded-xl text-emerald-600 font-medium">
                ✅ មិនមានទំនិញជិតអស់ពីស្តុកឡើយ! ស្តុកទាំងអស់មានសុវត្ថិភាព។
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

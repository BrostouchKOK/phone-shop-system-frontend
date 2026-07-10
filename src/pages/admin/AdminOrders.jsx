import React, { useEffect, useState } from "react";
import {
  apiAdminGetAllOrders,
  apiAdminUpdateOrderStatus,
} from "../../api/orderApi";
import { toast } from "react-hot-toast";
import { FiPackage } from "react-icons/fi";
import AdminSidebar from "../../components/AdminSidebar";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ហៅទាញយក Order ទាំងអស់ពី Database
  const fetchAllOrders = async () => {
    try {
      const response = await apiAdminGetAllOrders();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "មិនអាចទាញយកបញ្ជីបញ្ជាទិញបានឡើយ!",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // មុខងារចុចដូរ Status របស់ Order
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await apiAdminUpdateOrderStatus(orderId, newStatus);
      if (response.data.success) {
        toast.success(response.data.message);
        const updatedOrderFromBackend = response.data.data;
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: updatedOrderFromBackend.status,
                  isPaid: updatedOrderFromBackend.isPaid,
                }
              : order,
          ),
        );
      }
    } catch (error) {
      toast.error("ការផ្លាស់ប្តូរស្ថានភាពបានបរាជ័យ!");
    }
  };

  // អនុគមន៍ជំនួយសម្រាប់បង្ហាញពណ៌តាម Status នីមួយៗ
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-customBg">
        <div className="text-center py-20 text-gray-500 animate-pulse text-base font-medium">
          កំពុងផ្ទុកបញ្ជីបញ្ជាទិញរបស់ Admin...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-customBg flex flex-col md:flex-row">
      {/* ⚙️ ខ្ទាស់ Sidebar Menu ចូលទៅ */}
      <AdminSidebar />

      {/* 📦 ផ្ទាំងមាតិកាបង្ហាញតារាងទិន្នន័យ */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden pb-24 md:pb-8">
        {/* Header (កែទំហំអក្សរឱ្យធំច្បាស់) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-primary flex items-center gap-2">
              <FiPackage className="text-accent" /> គ្រប់គ្រងការបញ្ជាទិញ
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              ពិនិត្យ និងចាត់ចែងស្ថានភាពវិក្កយបត្ររបស់អតិថិជនទាំងអស់
            </p>
          </div>
          <span className="w-fit px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-primary shadow-sm">
            សរុប៖ {orders.length} វិក្កយបត្រ
          </span>
        </div>

        {/* តារាងបង្ហាញបញ្ជី Order */}
        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-500 text-sm sm:text-base">
            មិនទាន់មានការបញ្ជាទិញណាមួយនៅក្នុងប្រព័ន្ធនៅឡើយទេ។
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {/* 🛠️ បង្កើនទំហំអក្សរទូទៅក្នុង Table មកត្រឹម text-sm ទៅ text-base */}
              <table className="w-full text-left border-collapse min-w-[850px] md:min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">លេខវិក្កយបត្រ</th>
                    <th className="p-4">អតិថិជន</th>
                    <th className="p-4">ទូរស័ព្ទដៃ / ចំនួន</th>
                    <th className="p-4">តម្លៃសរុប</th>
                    <th className="p-4">ស្ថានភាព</th>
                    <th className="p-4 text-center">ចាត់ចែង</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm sm:text-base text-primary font-medium">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/50 transition"
                    >
                      {/* លេខវិក្កយបត្រ (ពង្រីកជា text-xs ទៅ text-sm) */}
                      <td className="p-4 font-mono text-xs sm:text-sm font-bold text-gray-600">
                        #{order._id?.substring(18).toUpperCase()}
                      </td>

                      {/* ព័ត៌មានអតិថិជន */}
                      <td className="p-4">
                        <div className="font-bold text-sm sm:text-base">
                          {order.user?.name || "គណនីត្រូវបានលុប"}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400 mt-1">
                          {order.shippingAddress?.phone}
                        </div>
                      </td>

                      {/* បញ្ជីទំនិញ */}
                      <td className="p-4 max-w-xs">
                        <div className="space-y-1">
                          {order.orderItems?.map((item, idx) => (
                            <p
                              key={idx}
                              className="text-xs sm:text-sm font-semibold truncate"
                            >
                              • {item.name}{" "}
                              <span className="text-gray-400 font-normal">
                                x{item.quantity}
                              </span>
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* តម្លៃសរុប & ការបង់លុយ */}
                      <td className="p-4 font-black text-accent text-sm sm:text-base">
                        ${order.totalPrice}
                        <span
                          className={`block text-xs mt-1 font-bold ${
                            order.isPaid ? "text-emerald-500" : "text-amber-500"
                          }`}
                        >
                          ({order.isPaid ? "បានបង់លុយ" : "មិនទាន់បង់"})
                        </span>
                      </td>

                      {/* ស្ថានភាពបច្ចុប្បន្ន */}
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Dropdown ចុចដូរ Status (ពង្រីកប្រអប់ និងអក្សរឱ្យធំស្រួលចុច) */}
                      <td className="p-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white text-primary font-bold focus:outline-none focus:border-accent cursor-pointer shadow-sm md:max-w-[160px]"
                        >
                          <option value="Pending">Pending (រង់ចាំ)</option>
                          <option value="Processing">
                            Processing (កំពុងរៀបចំ)
                          </option>
                          <option value="Shipped">Shipped (កំពុងដឹក)</option>
                          <option value="Delivered">
                            Delivered (បានប្រគល់)
                          </option>
                          <option value="Cancelled">Cancelled (លុបចោល)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

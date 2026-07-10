import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { apiGetUserProfile, apiUpdateUserProfile } from "../api/userApi";
import { apiGetMyOrders } from "../api/orderApi";
import { toast } from "react-hot-toast";
import {
  FiUser,
  FiPackage,
  FiLock,
  FiCheckCircle,
  FiClock,
  FiTruck,
} from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States សម្រាប់ Update Profile
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        // ហៅ API ទាំងពីរព្រមគ្នាដើម្បីសន្សំពេល
        const [profileRes, ordersRes] = await Promise.all([
          apiGetUserProfile(),
          apiGetMyOrders(),
        ]);
        console.log(profileRes);
        console.log(ordersRes);
        if (profileRes.data.success) {
          setUser(profileRes.data.data);
          setName(profileRes.data.data.name);
        }
        if (ordersRes.data.success) {
          setOrders(ordersRes.data.data);
        }
      } catch (error) {
        toast.error("មិនអាចទាញយកទិន្នន័យបានឡើយ!");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndOrders();
  }, []);

  // មុខងារកែប្រែព័ត៌មានផ្ទាល់ខ្លួន
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const updateData = { name };
      if (password) updateData.password = password; // បើមានវាយ password ថ្មី ទើបផ្ញើទៅ

      const response = await apiUpdateUserProfile(updateData);
      if (response.data.success) {
        toast.success(response.data.message);
        setUser({ ...user, name: response.data.data.name });
        setPassword(""); // សម្អាតចោលវិញក្រោយដូរជោគជ័យ
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "ការធ្វើបច្ចុប្បន្នភាពបានបរាជ័យ!",
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  // អនុគមន៍ជំនួយសម្រាប់បង្ហាញពណ៌តាម Status របស់ Order
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1 w-fit">
            <FiClock /> រង់ចាំពិនិត្យ
          </span>
        );
      case "processing":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1 w-fit">
            <FiPackage /> កំពុងរៀបចំ
          </span>
        );
      case "shipped":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100 flex items-center gap-1 w-fit">
            <FiTruck /> កំពុងដឹកជញ្ជូន
          </span>
        );
      case "delivered":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 w-fit">
            <FiCheckCircle /> បានប្រគល់ជោគជ័យ
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100 w-fit">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-customBg">
        <Navbar />
        <div className="text-center py-20 text-gray-400 animate-pulse text-sm">
          កំពុងទាញយកទិន្នន័យប្រវត្តិរូប...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-customBg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-black text-primary mb-8 tracking-tight flex items-center gap-2">
          <FiUser className="text-accent" /> គណនីរបស់ខ្ញុំ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 🪪 ផ្នែកខាងឆ្វេង៖ ព័ត៌មានផ្ទាល់ខ្លួន */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
              <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center text-accent text-xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-primary text-base">
                  {user.name}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <h3 className="font-black text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <FiLock /> កែប្រែព័ត៌មានគណនី
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  ឈ្មោះគណនី
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-accent text-primary bg-customBg font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  លេខកូដសម្ងាត់ថ្មី (ទុកទទេបើមិនចង់ដូរ)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-accent text-primary bg-customBg font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={updateLoading}
                className="w-full bg-accent text-white font-semibold py-2.5 rounded-xl transition hover:bg-opacity-90 disabled:bg-gray-200 disabled:text-gray-400 text-sm cursor-pointer shadow-md shadow-purple-100"
              >
                {updateLoading ? "កំពុងរក្សាទុក..." : "រក្សាទុកការផ្លាស់ប្តូរ"}
              </button>
            </form>
          </div>

          {/*  ផ្នែកខាងស្តាំ៖ ប្រវត្តិបញ្ជាទិញ */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-primary mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <FiPackage className="text-accent" /> ប្រវត្តិបញ្ជាទិញទំនិញ (
              {orders.length})
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm font-medium">
                លោកអ្នកមិនទាន់ធ្លាប់មានប្រវត្តិបញ្ជាទិញទំនិញនៅឡើយទេ។
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-100 rounded-2xl p-4 space-y-3 hover:shadow-sm transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-2.5">
                      <div>
                        <p className="text-xs font-bold text-gray-400">
                          លេខកូដវិក្កយបត្រ៖{" "}
                          <span className="text-primary font-mono">
                            #{order._id?.substring(18).toUpperCase()}
                          </span>
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          កាលបរិច្ឆេទ៖{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "kh-KH",
                          )}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    {/* បញ្ជីទំនិញក្នុង Order នីមួយៗ */}
                    <div className="space-y-2">
                      {order.orderItems?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-4 py-1"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-customBg rounded-lg overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                              <img
                                src={
                                  item.product?.images?.[0] ||
                                  "https://placehold.co/100x100?text=Phone"
                                }
                                alt=""
                                className="object-contain max-h-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-primary truncate">
                                {item.product?.name || "ផលិតផលមិនស្គាល់"}
                              </h4>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                ចំនួន៖ {item.quantity} គ្រឿង x ${item.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-50 pt-2.5 text-xs">
                      <span className="font-bold text-gray-500">
                        វិធីសាស្ត្រទូទាត់៖{" "}
                        <span className="text-primary font-medium">
                          {order.paymentMethod === "COD"
                            ? "ទូទាត់ពេលទំនិញមកដល់ (COD)"
                            : order.paymentMethod}
                        </span>
                      </span>
                      <span className="font-black text-accent text-sm">
                        សរុប៖ ${order.totalPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

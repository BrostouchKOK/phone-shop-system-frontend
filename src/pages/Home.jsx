import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { getAllProducts } from "../api/productApi";
import { toast } from "react-hot-toast";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚙️ States សម្រាប់ Search, Filter និង Pagination
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // បញ្ជីម៉ាកទូរស័ព្ទសម្រាប់ធ្វើជា Filter (អាចកែសម្រួលតាម Backend របស់អ្នក)
  const categories = ["Apple", "Samsung", "Oppo", "Vivo", "Xiaomi"];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // បោះ Params ទៅឱ្យ Backend API (សេវា Search, Filter, Pagination ដើរភ្លាម)
        const response = await getAllProducts({
          search,
          category,
          page,
          limit: 8, // បង្ហាញម្ដង ៨ គ្រឿងក្នុងមួយទំព័រ
        });

        if (response.data.success) {
          setProducts(response.data.data);
          setTotalPages(response.data.pagination.totalPages); // ចាប់យកចំនួនទំព័រសរុបពី Backend
        }
      } catch (err) {
        toast.error("មិនអាចទាញយកទិន្នន័យផលិតផលបានឡើយ!");
      } finally {
        setLoading(false);
      }
    };

    //បច្ចេកទេស Debounce តិចតួច៖ ទុកពេលឱ្យ User វាយអក្សរចប់ ៥០០ms សិនចាំបាញ់ទៅ API កុំឱ្យគាំង Server
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, category, page]); // 🔄 ឱ្យវាដើរឡើងវិញរាល់ពេល State ទាំងនេះប្រែប្រួល

  return (
    <div className="min-h-screen bg-customBg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SECTION: SEARCH & FILTER (Responsive Layout) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
          {/* Input ស្វែងរក */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 text-base">
              <FiSearch />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-customBg border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition text-sm font-medium"
              placeholder="ស្វែងរកទូរស័ព្ទដៃដែលអ្នកចង់បាន..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Buttons សម្រាប់ Filter ម៉ាកទូរស័ព្ទ */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => {
                setCategory("");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                category === ""
                  ? "bg-accent text-white shadow-md shadow-purple-100"
                  : "bg-customBg text-gray-500 hover:bg-gray-100"
              }`}
            >
              ទាំងអស់
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                  category === cat
                    ? "bg-accent text-white shadow-md shadow-purple-100"
                    : "bg-customBg text-gray-500 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/*SECTION: PRODUCT GRID */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium animate-pulse text-sm">
            កំពុងស្វែងរក និងទាញយកទិន្នន័យទូរស័ព្ទ...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium text-sm bg-white rounded-2xl border border-gray-100">
            មិនមានទូរស័ព្ទដៃដែលអ្នកចង់ស្វែងរកឡើយ។
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* 📄 SECTION: PAGINATION BUTTONS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition cursor-pointer text-gray-600"
                >
                  <FiChevronLeft className="text-base" />
                </button>

                <span className="text-xs font-bold text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100">
                  ទំព័រ {page} នៃ {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition cursor-pointer text-gray-600"
                >
                  <FiChevronRight className="text-base" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;

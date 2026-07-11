// 📄 src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import { showConfirmToast } from "../../utils/confirmToast";
import { toast } from "react-hot-toast";
import {
  FiSmartphone,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiSave,
  FiUploadCloud,
} from "react-icons/fi";
import AdminSidebar from "../../components/AdminSidebar";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States សម្រាប់ Search & Pagination
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalProducts: 0,
  });

  // 🛠️ States សម្រាប់គ្រប់គ្រង Modal (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    brand: "Apple",
    category: "",
    price: "",
    stock: "",
    description: "",
    imageFile: null,
  });

  // អនុគមន៍ទាញយកទិន្នន័យពី API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProducts({
        search: search || undefined,
        brand: brand || undefined,
        page: page,
        limit: 5,
      });
      if (response.data.success) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "មិនអាចទាញយកបញ្ជីផលិតផលបានឡើយ!",
      );
    } finally {
      setLoading(false);
    }
  };

  // អនុគមន៍ទាញយក Categories មកបង្ហាញក្នុង Dropdown Select
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("មិនអាចទាញយកទិន្នន័យប្រភេទផលិតផលបានទេ:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, brand]);

  // អនុគមន៍ស្វែងរកផលិតផល
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  // អនុគមន៍បើក Modal សម្រាប់បន្ថែមថ្មី
  const openAddModal = () => {
    setSelectedProduct(null);
    setImagePreview("");
    setFormData({
      name: "",
      brand: "Apple",
      category: "",
      price: "",
      stock: "",
      description: "",
      imageFile: null,
    });
    setIsModalOpen(true);
  };

  // អនុគមន៍បើក Modal សម្រាប់កែប្រែ
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setImagePreview(product.images?.[0] || "");
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category?._id || product.category || "",
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      imageFile: null,
    });
    setIsModalOpen(true);
  };

  // អនុគមន៍ចាប់យក File រូបភាពពេលអ្នកប្រើរើសពីម៉ាស៊ីន
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // អនុគមន៍រក្សាទុកទិន្នន័យ (ទាំង Add និង Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("category", formData.category);
    data.append("price", Number(formData.price));
    data.append("stock", Number(formData.stock));
    data.append("description", formData.description);

    if (formData.imageFile) {
      data.append("images", formData.imageFile);
    }

    try {
      if (selectedProduct) {
        const response = await updateProduct(selectedProduct._id, data);
        if (response.data.success) {
          toast.success(`បានកែប្រែទិន្នន័យផលិតផល "${formData.name}" រួចរាល់!`);
        }
      } else {
        const response = await createProduct(data);
        if (response.data.success) {
          toast.success(
            `បានបន្ថែមផលិតផលថ្មី "${formData.name}" ទៅក្នុងប្រព័ន្ធជោគជ័យ!`,
          );
        }
      }
      setIsModalOpen(false);
      setImagePreview("");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "សកម្មភាពមិនជោគជ័យឡើយ!");
    }
  };

  // អនុគមន៍លុបផលិតផល
  const handleDelete = (id, name) => {
    showConfirmToast(
      `តើបងពិតជាចង់លុបទូរស័ព្ទ "${name}" នេះចេញពីប្រព័ន្ធមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានឡើយ!`,
      async () => {
        try {
          const response = await deleteProduct(id);
          if (response.data.success) {
            toast.success("បានលុបផលិតផលចេញពីប្រព័ន្ធរួចរាល់!");
            fetchProducts();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "ការលុបបានបរាជ័យ!");
        }
      },
    );
  };

  return (
    <div className="min-h-screen bg-customBg flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-primary flex items-center gap-2">
              <FiSmartphone className="text-accent" /> គ្រប់គ្រងផលិតផល
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              ទិន្នន័យសរុបមានចំនួន៖ {pagination.totalProducts}{" "}
              គ្រឿងនៅក្នុងប្រព័ន្ធ
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-base font-black shadow-md transition cursor-pointer"
          >
            <FiPlus className="text-lg" /> បន្ថែមផលិតផលថ្មី
          </button>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <input
              type="text"
              placeholder="វាយឈ្មោះទូរស័ព្ទ រួចចុច Enter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-primary font-medium focus:outline-none focus:border-accent"
            />
            <FiSearch className="absolute left-4 top-4 text-gray-400 text-lg" />
          </form>

          <select
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setPage(1);
            }}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-primary font-bold focus:outline-none focus:border-accent cursor-pointer min-w-[160px]"
          >
            <option value="">ម៉ាកទាំងអស់ (All)</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Oppo">Oppo</option>
            <option value="Vivo">Vivo</option>
          </select>
        </div>

        {/* TABLE LIST */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-base font-medium animate-pulse">
            កំពុងទាញយកទិន្នន័យតាមតម្រូវការ...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-500 text-base">
            មិនមានទិន្នន័យទូរស័ព្ទណាត្រូវនឹងការស្វែងរករបស់អ្នកឡើយ។
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px] md:min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-4">រូបភាព</th>
                      <th className="p-4">ឈ្មោះទូរស័ព្ទ</th>
                      <th className="p-4">ម៉ាក (Brand)</th>
                      <th className="p-4">ប្រភេទ (Category)</th>
                      <th className="p-4">តម្លៃលក់</th>
                      <th className="p-4">ក្នុងស្តុក</th>
                      <th className="p-4 text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm sm:text-base text-primary font-medium">
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50/50 transition"
                      >
                        <td className="p-4">
                          <img
                            src={
                              product.images?.[0] ||
                              "https://placehold.co/150x150?text=No+Image"
                            }
                            alt={product.name}
                            className="w-14 h-14 object-contain rounded-xl border border-gray-100 bg-gray-50 p-1"
                          />
                        </td>
                        <td className="p-4 font-bold text-sm sm:text-base">
                          {product.name}
                        </td>
                        <td className="p-4 text-gray-500">{product.brand}</td>
                        <td className="p-4 text-gray-500">
                          {product.category?.name || "មិនមានប្រភេទ"}
                        </td>
                        <td className="p-4 font-black text-accent">
                          ${product.price}
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-bold ${product.stock > 0 ? "text-gray-700" : "text-rose-500"}`}
                          >
                            {product.stock > 0
                              ? `${product.stock} គ្រឿង`
                              : "ដាច់ស្តុក"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition text-base shadow-sm cursor-pointer"
                              title="កែប្រែ"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(product._id, product.name)
                              }
                              className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-700 hover:text-white rounded-xl transition text-base shadow-sm cursor-pointer"
                              title="លុបផលិតផល"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm sm:text-base text-gray-500 font-medium">
                ទំព័រទី{" "}
                <span className="text-primary font-bold">
                  {pagination.currentPage}
                </span>{" "}
                នៃទំព័រសរុប{" "}
                <span className="text-primary font-bold">
                  {pagination.totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="p-3 bg-white border border-gray-200 rounded-xl text-primary font-bold hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed text-base shadow-sm transition cursor-pointer"
                >
                  <FiChevronLeft />
                </button>
                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="p-3 bg-white border border-gray-200 rounded-xl text-primary font-bold hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed text-base shadow-sm transition cursor-pointer"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🌟 MODAL FORM COMPONENT (ADD & EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-black text-primary">
                {selectedProduct
                  ? `📝 កែប្រែព័ត៌មាន៖ ${selectedProduct.name}`
                  : "✨ បន្ថែមផលិតផលថ្មីចូលស្តុក"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200/50 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Body Forms */}
            <form
              onSubmit={handleFormSubmit}
              className="flex-1 overflow-y-auto p-5 space-y-4"
            >
              {/* Input ឈ្មោះផលិតផល */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600">
                  ឈ្មោះទូរស័ព្ទ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ឧទាហរណ៍៖ iPhone 15 Pro Max"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-primary font-medium focus:outline-none focus:border-accent focus:bg-white transition"
                />
              </div>

              {/* Grid ម៉ាក និងប្រភេទ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-600">
                    ម៉ាក (Brand) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-primary font-bold focus:outline-none focus:border-accent cursor-pointer transition"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Oppo">Oppo</option>
                    <option value="Vivo">Vivo</option>
                    <option value="Xiaomi">Xiaomi</option>
                  </select>
                </div>

                {/* Input Select សម្រាប់ជ្រើសរើសប្រភេទ (Category) */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-600">
                    ប្រភេទ (Category) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-primary font-bold focus:outline-none focus:border-accent cursor-pointer transition"
                  >
                    <option value="">-- រើសប្រភេទ --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid តម្លៃ និងស្តុក */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-600">
                    តម្លៃលក់ ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="1199"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-primary focus:outline-none focus:border-accent focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-600">
                    ចំនួនក្នុងស្តុក <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-primary focus:outline-none focus:border-accent focus:bg-white transition"
                  />
                </div>
              </div>

              {/* ផ្នែករើសរូបថត និង Upload ពីម៉ាស៊ីន */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600">
                  រូបភាពផលិតផល
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 font-medium text-center p-1">
                        គ្មានរូប
                      </span>
                    )}
                  </div>

                  <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:bg-gray-50 p-4 transition cursor-pointer text-center">
                    <FiUploadCloud className="text-2xl text-gray-400 mb-1" />
                    <span className="text-sm font-bold text-primary">
                      ចុចទីនេះដើម្បីជ្រើសរើសរូបថត
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      គាំទ្រប្រភេទ JPG, PNG, WEBP
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* ផ្នែកពិពណ៌នាផលិតផល */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600">
                  ការពិពណ៌នាផលិតផល
                </label>
                <textarea
                  rows="3"
                  placeholder="ព័ត៌មានបន្ថែមទាក់ទងនឹងទំហំផ្ទុក ពណ៌ ឬលក្ខខណ្ឌធានា..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-primary focus:outline-none focus:border-accent focus:bg-white transition resize-none"
                />
              </div>

              {/* ប៊ូតុងបញ្ជា (បោះបង់ និង រក្សាទុក) */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-xl text-sm transition cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-sm shadow-md transition cursor-pointer"
                >
                  <FiSave />{" "}
                  {selectedProduct ? "រក្សាទុកការកែប្រែ" : "រក្សាទុកទិន្នន័យ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

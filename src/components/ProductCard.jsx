import React from "react";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://placehold.co/400x400?text=No+Image";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="w-full aspect-square bg-customBg rounded-xl overflow-hidden mb-4 relative flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="object-contain max-h-[80%] w-auto group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              អស់ស្តុក
            </span>
          )}
        </div>

        <h3 className="font-bold text-primary text-sm sm:text-base line-clamp-1 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 h-8">
          {product.description}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-accent font-extrabold text-base sm:text-lg">
            ${product.price}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            សល់ {product.stock} គ្រឿង
          </span>
        </div>

        <button
          disabled={product.stock === 0}
          className="w-full mt-4 bg-primary text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition duration-200 hover:bg-accent disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer"
        >
          មើលលម្អិត
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

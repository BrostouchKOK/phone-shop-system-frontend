// 📄 src/utils/confirmToast.jsx
import React from "react";
import { toast } from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

export const showConfirmToast = (message, onConfirm) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col p-5 border border-gray-100`}
      >
        <div className="flex items-start gap-3">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl text-xl shrink-0">
            <FiAlertTriangle />
          </div>
          <div className="space-y-1">
            <p className="text-base font-black text-primary">បញ្ជាក់សកម្មភាព</p>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-5">
          {/* ប៊ូតុង បោះបង់ (ថែម cursor-pointer) */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-xl text-sm transition cursor-pointer"
          >
            បោះបង់
          </button>

          {/* ប៊ូតុង យល់ព្រម (ថែម cursor-pointer) */}
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-sm shadow-sm transition cursor-pointer"
          >
            យល់ព្រម
          </button>
        </div>
      </div>
    ),
    { duration: Infinity },
  );
};

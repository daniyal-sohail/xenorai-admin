"use client";

import { FC, memo, useState } from "react";
import { Edit2, Trash2, Power, ExternalLink, Package, MoreVertical, Image as ImageIcon } from "lucide-react";
import { IProduct } from "./ProductTypes";

interface ProductTableProps {
  products: IProduct[];
  loading: boolean;
  onToggle: (id: string) => void;
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}

const ProductTableComponent: FC<ProductTableProps> = ({
  products,
  loading,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => new Set(prev).add(productId));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
            <Package className="text-indigo-600" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-600">Get started by adding your first product</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
          <div className="col-span-1">Image</div>
          <div className="col-span-3">Product</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y-2 divide-gray-100">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 transition-all duration-200 items-center group"
            style={{
              animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
            }}
          >
            {/* Product Image */}
            <div className="col-span-1">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg transition-shadow">
                {product.image && !imageErrors.has(product._id) ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(product._id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={28} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="col-span-3">
              <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="col-span-2">
              {product.category ? (
                <span className="inline-flex px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
                  {product.category}
                </span>
              ) : (
                <span className="text-gray-400 text-sm">No category</span>
              )}
            </div>

            {/* Price */}
            <div className="col-span-2">
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <button
                onClick={() => onToggle(product._id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 ${product.isActive
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${product.isActive ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                />
                {product.isActive ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center justify-end gap-2">
              {product.checkoutLink && (
                <a
                  href={product.checkoutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all hover:scale-110"
                  title="View Product"
                >
                  <ExternalLink size={18} />
                </a>
              )}

              <button
                onClick={() => onEdit(product)}
                className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-all hover:scale-110"
                title="Edit Product"
              >
                <Edit2 size={18} />
              </button>

              <button
                onClick={() => onDelete(product._id)}
                className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all hover:scale-110"
                title="Delete Product"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
    </div>
  );
};

export const ProductTable = memo(ProductTableComponent);
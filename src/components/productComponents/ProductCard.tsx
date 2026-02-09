"use client";

import { FC, memo, useCallback, useState } from "react";
import { MoreVertical, Edit2, Trash2, Power, ExternalLink, DollarSign, Package } from "lucide-react";
import { IProduct } from "./ProductTypes";

interface ProductCardProps {
  product: IProduct;
  onToggle: (id: string) => void;
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}

const ProductCardComponent: FC<ProductCardProps> = ({
  product,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleToggle = useCallback(() => {
    onToggle(product._id);
  }, [product._id, onToggle]);

  const handleEdit = useCallback(() => {
    onEdit(product);
    setMenuOpen(false);
  }, [product, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(product._id);
    setMenuOpen(false);
  }, [product._id, onDelete]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-indigo-200">
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${product.isActive
            ? "bg-emerald-500 text-white"
            : "bg-gray-400 text-white"
            }`}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg transition-colors shadow-sm"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Edit2 size={16} />
                  Edit Product
                </button>
                <button
                  onClick={handleToggle}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Power size={16} />
                  {product.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 size={16} />
                  Delete Product
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={64} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Category */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <DollarSign size={18} className="text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
          {product.category && (
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium">
              {product.category}
            </span>
          )}
        </div>

        {/* Checkout Link */}
        {product.checkoutLink && (
          <a
            href={product.checkoutLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
          >
            <ExternalLink size={16} />
            View Product
          </a>
        )}
      </div>
    </div>
  );
};

export const ProductCard = memo(ProductCardComponent);
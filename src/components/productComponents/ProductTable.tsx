"use client";

import { FC, memo, useState } from "react";
import { Edit2, Trash2, Power, ExternalLink, Package } from "lucide-react";
import { IProduct } from "./ProductTypes";

interface ProductTableProps {
  products: IProduct[];
  loading: boolean;
  onToggle: (id: string) => void;
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

const ActionBtn: FC<{
  onClick: () => void;
  title: string;
  variant: "edit" | "delete" | "link";
  children: React.ReactNode;
  href?: string;
}> = ({ onClick, title, variant, children, href }) => {
  const [hovered, setHovered] = useState(false);

  const styles = {
    edit: { base: { color: "#6b7280", background: "transparent" }, hover: { color: "#f97518", background: "rgba(249,117,24,0.08)" } },
    delete: { base: { color: "#6b7280", background: "transparent" }, hover: { color: "#ef4444", background: "rgba(239,68,68,0.08)" } },
    link: { base: { color: "#6b7280", background: "transparent" }, hover: { color: "#3b82f6", background: "rgba(59,130,246,0.08)" } },
  };

  const style = hovered ? styles[variant].hover : styles[variant].base;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
      style={style}
    >
      {children}
    </button>
  );
};

const ProductTableComponent: FC<ProductTableProps> = ({
  products,
  loading,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div
        className="rounded-2xl overflow-hidden bg-white"
        style={{ border: "1px solid #e5e7eb" }}
      >
        <div className="p-12 flex flex-col items-center justify-center gap-3">
          <span
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(249,117,24,0.2)", borderTopColor: "#f97518" }}
          />
          <p className="text-sm text-gray-500 font-medium">Loading products…</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="rounded-2xl overflow-hidden bg-white"
        style={{ border: "1px solid #e5e7eb" }}
      >
        <div className="p-16 flex flex-col items-center justify-center text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(249,117,24,0.08)", border: "1px solid rgba(249,117,24,0.15)" }}
          >
            <Package size={28} style={{ color: "#f97518" }} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No Products Yet</h3>
          <p className="text-sm text-gray-500">Get started by adding your first product</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white"
      style={{ border: "1px solid #e5e7eb" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
              {[
                { label: "Product", cls: "px-5 text-left" },
                { label: "Category", cls: "px-4 text-left hidden sm:table-cell" },
                { label: "Price", cls: "px-4 text-left" },
                { label: "Status", cls: "px-4 text-left" },
                { label: "Actions", cls: "px-4 text-right" },
              ].map(({ label, cls }) => (
                <th
                  key={label}
                  className={`${cls} py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className="group transition-colors hover:bg-gray-50/80"
                style={{ borderBottom: index < products.length - 1 ? "1px solid #f3f4f6" : "none" }}
              >
                {/* Product */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
                    >
                      {product.image && !imageErrors.has(product._id) ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={() => setImageErrors((prev) => new Set(prev).add(product._id))}
                        />
                      ) : (
                        <Package size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate leading-tight group-hover:text-[#f97518] transition-colors">
                        {product.name}
                      </p>
                      {product.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5 max-w-[200px]">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  {product.category ? (
                    <span
                      className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: "rgba(249,117,24,0.08)", color: "#ea5a00", border: "1px solid rgba(249,117,24,0.15)" }}
                    >
                      {product.category}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>

                {/* Price */}
                <td className="px-4 py-3.5">
                  <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => onToggle(product._id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all hover:opacity-80"
                    style={
                      product.isActive
                        ? { background: "rgba(52,211,153,0.1)", color: "#059669", border: "1px solid rgba(52,211,153,0.25)" }
                        : { background: "#f9fafb", color: "#9ca3af", border: "1px solid #e5e7eb" }
                    }
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: product.isActive ? "#34d399" : "#d1d5db" }}
                    />
                    {product.isActive ? "Active" : "Inactive"}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-0.5">
                    {product.checkoutLink && (
                      <ActionBtn onClick={() => { }} title="View Product" variant="link" href={product.checkoutLink}>
                        <ExternalLink size={14} />
                      </ActionBtn>
                    )}
                    <ActionBtn onClick={() => onEdit(product)} title="Edit" variant="edit">
                      <Edit2 size={14} />
                    </ActionBtn>
                    <ActionBtn onClick={() => onDelete(product._id)} title="Delete" variant="delete">
                      <Trash2 size={14} />
                    </ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ProductTable = memo(ProductTableComponent);
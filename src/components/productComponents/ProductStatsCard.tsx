"use client";

import { FC, memo } from "react";
import { Package, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { IProduct } from "./ProductTypes";

interface ProductStatsCardProps {
    products: IProduct[];
}

const ProductStatsCardComponent: FC<ProductStatsCardProps> = ({ products }) => {
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const inactiveProducts = totalProducts - activeProducts;
    const averagePrice =
        totalProducts > 0
            ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
            : 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const stats = [
        {
            label: "Total Products",
            value: totalProducts,
            icon: Package,
            color: "indigo",
            bgColor: "bg-indigo-100",
            textColor: "text-indigo-600",
        },
        {
            label: "Active Products",
            value: activeProducts,
            icon: CheckCircle,
            color: "emerald",
            bgColor: "bg-emerald-100",
            textColor: "text-emerald-600",
        },
        {
            label: "Inactive Products",
            value: inactiveProducts,
            icon: XCircle,
            color: "gray",
            bgColor: "bg-gray-100",
            textColor: "text-gray-600",
        },
        {
            label: "Average Price",
            value: formatPrice(averagePrice),
            icon: DollarSign,
            color: "purple",
            bgColor: "bg-purple-100",
            textColor: "text-purple-600",
            isPrice: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium mb-1">
                                {stat.label}
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {stat.isPrice ? stat.value : stat.value}
                            </p>
                        </div>
                        <div
                            className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                        >
                            <stat.icon className={stat.textColor} size={24} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ProductStatsCard = memo(ProductStatsCardComponent);
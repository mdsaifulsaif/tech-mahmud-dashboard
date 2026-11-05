"use client";

import React from "react";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import Link from "next/link";

const vegetableProducts = [
  {
    id: 201,
    name: "Fresh Broccoli",
    categoryName: "Vegetables",
    price: 120,
    mrp: 150,
    rating: 4.8,
    reviews: 85,
    image:
      "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=800", // সুগন্ধি লেবু
  },
  {
    id: 202,
    name: "Organic Carrots",
    categoryName: "Vegetables",
    price: 50,
    mrp: 70,
    rating: 4.7,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1444312645910-ffa973656eba?q=80&w=800", // গাজর (নতুন লিঙ্ক)
  },
  {
    id: 203,
    name: "Fresh Spinach",
    categoryName: "Vegetables",
    price: 40,
    mrp: 55,
    rating: 4.9,
    reviews: 205,
    image:
      "https://images.unsplash.com/photo-1557844352-761f2565b576?q=80&w=800", // ফুলকপি (নতুন লিঙ্ক)
  },
  {
    id: 204,
    name: "Bell Pepper Mix",
    categoryName: "Vegetables",
    price: 180,
    mrp: 220,
    rating: 4.6,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?q=80&w=800", // ক্যাপসিকাম মিক্স (নতুন লিঙ্ক)
  },
  {
    id: 205,
    name: "Farm Fresh Potato",
    categoryName: "Vegetables",
    price: 30,
    mrp: 45,
    rating: 4.5,
    reviews: 310,
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800", // আলু (নতুন লিঙ্ক)
  },
  {
    id: 206,
    name: "Fresh Red Onion",
    categoryName: "Vegetables",
    price: 75,
    mrp: 90,
    rating: 4.7,
    reviews: 185,
    image:
      "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=800", // দেশি পেঁয়াজ (নতুন লিঙ্ক)
  },
  {
    id: 207,
    name: "Green Chili Premium",
    categoryName: "Vegetables",
    price: 110,
    mrp: 140,
    rating: 4.8,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800", // কাঁচা মরিচ (নতুন লিঙ্ক)
  },
  {
    id: 208,
    name: "Fresh Cauliflower",
    categoryName: "Vegetables",
    price: 55,
    mrp: 70,
    rating: 4.6,
    reviews: 73,
    image:
      "https://images.unsplash.com/photo-1557844352-761f2565b576?q=80&w=800", // ফুলকপি (নতুন লিঙ্ক)
  },
  {
    id: 209,
    name: "Organic Cucumber",
    categoryName: "Vegetables",
    price: 45,
    mrp: 60,
    rating: 4.5,
    reviews: 120,
    image:
      "https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=800", // শসা (নতুন লিঙ্ক)
  },
  {
    id: 210,
    name: "Fresh Lemon Pack (4pcs)",
    categoryName: "Vegetables",
    price: 25,
    mrp: 35,
    rating: 4.9,
    reviews: 240,
    image:
      "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=800", // সুগন্ধি লেবু
  },
];
const FreshVegetableCorner: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* হেডিং এবং বাটন সেকশন - Flex Justify Between */}
      <div className="flex items-end justify-between mb-10 gap-4">
        <div className="flex-1">
          <SectionHeading
            description="Hand-picked fresh vegetables from local farms."
            heading="Fresh Vegetable "
            colorHeading="Corner"
          />
        </div>

        {/* View All বাটন */}
        <Link
          href="/shop/vegetables"
          className="hidden sm:block bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 whitespace-nowrap"
        >
          View All
        </Link>
      </div>

      {/* প্রোডাক্ট গ্রিড */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {vegetableProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* মোবাইলের জন্য নিচে বাটন */}
      <div className="sm:hidden text-center mt-8">
        <Link
          href="/shop/vegetables"
          className="inline-block border border-black px-8 py-3 rounded-full text-sm font-medium"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default FreshVegetableCorner;

"use client";

import React from "react";
import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";

// Swiper React কম্পোনেন্ট এবং মডিউল ইম্পোর্ট
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper এর প্রয়োজনীয় CSS ফাইল
import "swiper/css";
import "swiper/css/pagination";

// সবজি ও প্রয়োজনীয় জিনিসের কম্বো ডাটা
const comboProducts = [
  {
    id: 301,
    name: "Daily Veggie Combo (5kg)",
    categoryName: "Combo",
    price: 450,
    mrp: 600,
    rating: 4.9,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4d99?q=80&w=800", // তাজা শাকসবজির ঝুড়ি
  },
  {
    id: 302,
    name: "Cooking Essentials Pack",
    categoryName: "Combo",
    price: 850,
    mrp: 1100,
    rating: 4.8,
    reviews: 95,
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800", // মশলা, তেল ও রান্নার প্রয়োজনীয় জিনিস
  },
  {
    id: 303,
    name: "Breakfast Protein Kit",
    categoryName: "Combo",
    price: 320,
    mrp: 400,
    rating: 4.7,
    reviews: 78,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800", // ডিম, ব্রেড ও সকালের নাস্তার হেলদি আইটেম
  },
  {
    id: 304,
    name: "Fruit Medley Box",
    categoryName: "Combo",
    price: 550,
    mrp: 750,
    rating: 4.9,
    reviews: 110,
    image:
      "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?q=80&w=800", // বিভিন্ন পদের মিক্সড ফ্রেশ ফল
  },
  {
    id: 305,
    name: "Healthy Salad Combo",
    categoryName: "Combo",
    price: 280,
    mrp: 350,
    rating: 4.6,
    reviews: 65,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800", // শসা, লেটুস ও সালাদের পুরো সেট
  },
  {
    id: 306,
    name: "Organic Grocery Bundle",
    categoryName: "Combo",
    price: 1200,
    mrp: 1500,
    rating: 4.9,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800", // চাল, ডাল, তেলসহ বড় ফ্যামিলি কম্বো ব্যাগ
  },
];

const ComboDeals: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 combo-deals-section">
      {/* হেডিং এবং বাটন সেকশন */}
      <div className="flex items-end justify-between mb-10 gap-4">
        <div className="flex-1">
          <SectionHeading
            description="Save big with our handpicked value bundles."
            heading="Best Value "
            colorHeading="Combos"
          />
        </div>

        <Link
          href="/shop/vegetables"
          className="hidden sm:block bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 whitespace-nowrap"
        >
          View All
        </Link>
      </div>

      {/* গ্রিডের পরিবর্তে কাস্টমাইজড Swiper Slider */}
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        loop={true}
        speed={800}
        watchSlidesProgress={true}
        roundLengths={true}
        // হার্ডওয়্যার লেভেলে ট্রানজিশন ফিক্স করার হ্যাক
        onBeforeInit={(swiper: any) => {
          swiper.params.virtualTranslate = false;
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 3500, // Daily Essentials থেকে ৫০০ মিলিগ্রাম গ্যাপ রাখা হয়েছে যাতে দুটো স্লাইডার একসাথে মুভ না করে চোখের শান্তি দেয়
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          710: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 24,
          },
        }}
        className="w-full !pb-12"
      >
        {comboProducts.map((p) => (
          <SwiperSlide
            key={p.id}
            className="h-auto"
            style={{
              transform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="h-full pb-2">
              <ProductCard product={p} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* মোবাইলের জন্য নিচে বাটন (স্লাইডারের নিচে ডট থাকার কারণে মার্জিন mt-4 করা হয়েছে) */}
      <div className="sm:hidden text-center mt-4">
        <Link
          href="/shop/combos"
          className="inline-block bg-[#98EBB1] px-8 py-3 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform"
        >
          View All Combos
        </Link>
      </div>
    </div>
  );
};

export default ComboDeals;

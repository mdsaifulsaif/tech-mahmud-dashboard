

"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";

import "swiper/css";
import CategoryCard from "./_components/CategoryCard";

const HomeCategory = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery({});
  const categories = data?.data || [];

  if (isLoading) return <div className="py-10 text-center">Loading...</div>;
  if (isError) return null;

  return (
    <div className="pb-10 pt-4">
      <div className="container">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={3}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
        >
          {categories.map((category: any) => (
            <SwiperSlide key={category._id}>
              <CategoryCard category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCategory;
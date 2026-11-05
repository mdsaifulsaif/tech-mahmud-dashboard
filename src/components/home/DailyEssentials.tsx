"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import ProductModal, { Product } from "@/components/shared/ProductModal"; // tomar actual path diyo
import { useGetProductsQuery } from "@/redux/api/productApi";
import { useAppDispatch } from "@/redux";
import { addToCart, decreaseQuantity } from "@/redux/slices/cartSlice";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const DailyEssentials: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data, isLoading, isError } = useGetProductsQuery({
    limit: 10,
    status: "active",
  });

  const dailyProducts: Product[] = data?.data || [];

  // ---- Modal state ----
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product, variant: any, quantity: number) => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: variant ? variant.salePrice || variant.regularPrice : (product.salePrice || product.regularPrice),
        mrp: variant ? variant.regularPrice : product.regularPrice,
        image: product.thumbnail,
        category: product.categoryID?.name || "",
      })
    );
    handleCloseModal();
  };

  // related products = baki shob product, current ta বাদ diye (simple version)
  const relatedProducts = selectedProduct
    ? dailyProducts.filter((p) => p._id !== selectedProduct._id).slice(0, 4)
    : [];

  return (
    <div className="container mx-auto px-4 py-16 daily-essentials-section">
      <div className="mb-10 flex items-center justify-between">
        <SectionHeading
          description="Freshness delivered to your kitchen every day."
          heading="Daily "
          colorHeading="Essentials"
        />
        <Link
          href="/shop"
          className="hidden sm:block bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 whitespace-nowrap"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : isError ? (
        <div className="text-center py-10 text-red-500">Failed to load products.</div>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          loop={true}
          speed={800}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            710: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 24 },
          }}
          className="w-full !pb-12"
        >
          {dailyProducts.map((p) => (
            <SwiperSlide key={p._id} className="h-auto">
              <div className="h-full pb-2">
                {/* ProductCard-e onClick/onQuickView prop pass korlam, oikhane oitar
                    upor click korle ba "quick view" icon e click korle eta call hobe */}
                <ProductCard product={p} onClick={() => handleOpenModal(p)} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* ---- Product Modal ---- */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          relatedProducts={relatedProducts}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          onBuyNow={(product, variant, quantity) => {
            handleAddToCart(product, variant, quantity);
            router.push("/checkout");
          }}
          onAddRelated={(rp) => handleAddToCart(rp, null, 1)}
          onDecreaseRelated={(rp) => dispatch(decreaseQuantity(rp._id))}
        />
      )}
    </div>
  );
};

export default DailyEssentials;
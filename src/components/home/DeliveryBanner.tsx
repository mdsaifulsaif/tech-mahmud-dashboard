"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const leftTruck = "/home/car.png";

const DeliveryBanner = () => {
  return (
    <div className=" bg-white">
      <div className="container mx-auto px-4">
        
      
        <div className="rounded-[24px] bg-[#F4F6FA] overflow-hidden grid grid-cols-1 md:grid-cols-5 items-center p-6 sm:p-8 md:py-8 md:px-12 gap-8 md:gap-4">
          
         
          <div className="w-full md:col-span-3 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
         
            <div className="flex-shrink-0 max-w-[160px] sm:max-w-[180px] md:max-w-[200px] w-full">
              <Image
                src={leftTruck}
                alt="Grocery Delivery Van"
                width={200}
                height={130}
                className="object-contain w-full h-auto"
                priority
              />
            </div>
            
            {/* টেক্সট ব্লক */}
            <div className="flex flex-col justify-center pt-2">
              <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-extrabold text-[#232630] leading-[1.2] tracking-tight capitalize">
              groceries delivered <br className="hidden lg:block" /> in 60 minutes max!
              </h2>
              <p className="text-[#6B7280] mt-2 text-[14px] font-medium">
                Fresh and fast, right at your door step anytime.
              </p>
            </div>
          </div>

      
          <div className="w-full md:col-span-2 flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-center md:justify-end gap-6 lg:gap-8">
            
     

           
            <div className="flex-shrink-0">
              <Link
                href="/shop"
                className=" btn bg-[var(--color-primary)] text-white"
              >
                Order Now
              </Link>
            </div>

          </div>

        </div>
      </div>

    
      
    </div>
  );
};

export default DeliveryBanner;





"use client";

import React from 'react';
import Link from 'next/link';

const ThreeBanners = () => {
    // ডাটা স্ট্রাকচার আগের মতোই আছে, জাস্ট বাটনের টেক্সট ডায়নামিক করার সুবিধা রাখা হয়েছে
    const banners = [
        {
            id: 1,
            title: "grab your favorite flavor",
            link: "/shop?filter=spices",
            bgImage: "/home/1.png"
        },
        {
            id: 2,
            title: "make a refreshing choice",
            link: "/shop?filter=semai",
            bgImage: "/home/2.png"
        },
        {
            id: 3,
            title: "bring out the good chips",
            link: "/shop?filter=nuts",
            bgImage: "/home/3.png"
        }
    ];

    return (
        <div className="">
            {/* গ্লোবাল container ক্লাস */}
            <div className="container">
                {/* ৩ কলামের রেসপনসিভ গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
                    {banners.map((banner) => (
                        <div 
                            key={banner.id}
                            className="relative rounded-[20px] overflow-hidden min-h-[220px] md:min-h-[250px] bg-cover bg-center transition-all duration-300"
                            style={{ backgroundImage: `url(${banner.bgImage})` }}
                        >
                            {/* টেক্সট কন্টেইনার (বাম পাশে পজিশন করার জন্য এবং কন্টেন্ট গুলোর মাঝে গ্যাপ রাখার জন্য) */}
                            <div className="absolute inset-0 flex flex-col justify-center items-start pl-6 md:pl-8 max-w-[55%] z-10">
                                
                                {/* মেইন টাইটেল - গ্লোবাল Poppins ফন্ট */}
                                <h3 className="text-white text-[22px] md:text-[26px] font-bold leading-[1.1] tracking-tight capitalize mb-4">
                                    {banner.title}
                                </h3>

                                {/* আপনার গ্লোবাল .btn ক্লাস এবং হোভার ইফেক্ট দিয়ে তৈরি Shop Now বাটন */}
                                <Link 
                                    href={banner.link} 
                                    className="btn bg-white text-black font-semibold rounded-full px-5 !py-.3 text-[13px] transition-all hover:bg-gray-100"
                                >
                                    Shop Now
                                </Link>

                            </div>

                            {/* পুরো কার্ডটাই ক্লিকেবল করার জন্য একটি ওভারলে লিঙ্ক (ঐচ্ছিক, বাটনকে ডিস্টার্ব করবে না) */}
                            <Link href={banner.link} className="absolute inset-0 z-0" aria-label={banner.title} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThreeBanners;
// "use client";

// import React, { useState, useEffect } from 'react';

// interface HeroProps {
//     // Dynamic banner image handle korar array (Default vabe 1ta thakbe)
//     banners?: string[];
// }

// const Hero: React.FC<HeroProps> = ({ 
//     banners = ["/banner/banner5.png"] 
// }) => {
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const isSliderEnabled = banners.length > 1;

//     // Multiple image thakle auto-play sliding mechanism build kora hoyeche
//     useEffect(() => {
//         if (!isSliderEnabled) return;

//         const slideInterval = setInterval(() => {
//             setCurrentSlide((prev) => (prev + 1) % banners.length);
//         }, 5000); // Protite slide 5 second por por change hobe

//         return () => clearInterval(slideInterval);
//     }, [isSliderEnabled, banners.length]);

//     return (
//         <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6'>
//             <div className='w-full'>
//                 {/* 
//                   Apnar custom design layout onujayi absolute height container:
//                   Desktop high-end devices-e exact h-[570px] thakbe, 
//                   ebong mobile screens-e automatic standard layout balance korbe.
//                 */}
//                 <div className='w-full h-[320px] sm:h-[450px] md:h-[520px] lg:h-[570px] rounded-2xl overflow-hidden relative group shadow-sm bg-white'>
                    
//                     {/* Banners Renderer Map */}
//                     {banners.map((image, index) => (
//                         <div 
//                             key={index}
//                             className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out ${
//                                 index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
//                             }`}
//                             style={{ backgroundImage: `url("${image}")` }}
//                         >
//                             {/* Professional Touch: Elegant Soft Overlay */}
//                             <div className='absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none'></div>
//                         </div>
//                     ))}

//                     {/* Conditional Rendering: Multiple image thaklei shudhu dynamic dots asbe */}
//                     {isSliderEnabled && (
//                         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
//                             {banners.map((_, index) => (
//                                 <button 
//                                     key={index}
//                                     onClick={() => setCurrentSlide(index)}
//                                     aria-label={`Go to slide ${index + 1}`}
//                                     className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer outline-none border-none ${
//                                         index === currentSlide 
//                                             ? "w-10 bg-[var(--color-primary)]" 
//                                             : "w-3 bg-white/60 hover:bg-white"
//                                     }`}
//                                 ></button>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Hero;







"use client";

import React, { useState, useEffect } from 'react';

interface HeroProps {
    banners?: string[];
}

const Hero: React.FC<HeroProps> = ({ 
    banners = ["/banner/banner5.png"] 
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const isSliderEnabled = banners.length > 1;

    useEffect(() => {
        if (!isSliderEnabled) return;

        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(slideInterval);
    }, [isSliderEnabled, banners.length]);

    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
            <div className='w-full'>
                {/* এখানে কন্টেইনারের হাইট পুরোপুরি ইমেজের ওপর ছেড়ে দেওয়া হয়েছে:
                  ১. মোবাইলে 'h-auto' এবং 'aspect-[16/9]' বা ইমেজের রেশিও অনুযায়ী কন্টেইনার নিজে থেকে ছোট-বড় হবে। কোনো এক্সট্রা কালার বা ব্যাকগ্রাউন্ড আসবে না।
                  ২. ডেক্সটপে (lg) আপনার দেওয়া ফিক্সড 'h-[570px]' এ কাজ করবে এবং ইমেজটি পুরো উইডথ জুড়ে সুন্দর লাগবে।
                */}
                <div className='w-full h-auto aspect-[16/9] sm:aspect-[16/7] md:h-[400px] lg:h-[400px] xl:h-[570px] rounded-2xl overflow-hidden relative group shadow-sm'>
                    
                    {/* Banners Renderer Map */}
                    {banners.map((image, index) => (
                        <div 
                            key={index}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                        >
                            {/* div-এর background বাদ দিয়ে সরাসরি img ট্যাগ ব্যবহার করা হয়েছে।
                              এটি মোবাইলে ডানে-বামে একটুও না কেটে আপনার আসল ইমেজটিকেই পুরো স্ক্রিনে ফুটিয়ে তুলবে।
                            */}
                            <img 
                                src={image} 
                                alt={`Tech Mahmud Banner ${index + 1}`}
                                className="w-full h-full object-fill md:object-cover" 
                            />
                            
                            {/* Elegant Soft Overlay */}
                            <div className='absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none'></div>
                        </div>
                    ))}

                    {/* Slider Dots */}
                    {isSliderEnabled && (
                        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
                            {banners.map((_, index) => (
                                <button 
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                    className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer outline-none border-none ${
                                        index === currentSlide 
                                            ? "w-6 sm:w-10 bg-[var(--color-primary)]" 
                                            : "w-2 sm:w-3 bg-white/60 hover:bg-white"
                                    }`}
                                ></button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hero;
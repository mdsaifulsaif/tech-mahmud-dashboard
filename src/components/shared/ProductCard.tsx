







// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { FiHeart, FiEye, FiZap, FiPlus, FiMinus } from 'react-icons/fi';
// import { FaStar } from 'react-icons/fa';
// import { useSelector } from 'react-redux'; // কার্ট স্টেট দেখার জন্য
// import { useAppDispatch } from '@/redux';
// import { addToCart } from '@/redux/slices/cartSlice';
// import { addToWishlist } from '@/redux/slices/wishlistSlice';

// // ধরে নিচ্ছি আপনার cartSlice-এ quantity কমানো বা আইটেম রিমুভ করার জন্য অ্যাকশন আছে
// // যদি অ্যাকশনের নাম ভিন্ন হয়, জাস্ট এখান থেকে ইম্পোর্ট চেঞ্জ করে নিবেন
// import { removeFromCart, updateQuantity } from '@/redux/slices/cartSlice'; 

// interface Product {
//     id: number;
//     name: string;
//     image: string;
//     price: number;
//     originalPrice?: number;
//     mrp?: number;
//     discount?: number | string;
//     rating: number;
//     reviews: number;
//     categoryName?: string;
// }

// interface ProductCardProps {
//     product: Product;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//     const dispatch = useAppDispatch();
//     const router = useRouter();

//     // Redux স্টেট থেকে এই প্রোডাক্টটি অলরেডি কার্টে কয়টা আছে তা চেক করা হচ্ছে
//     const cartItems = useSelector((state: any) => state.cart.items || []);
//     const currentCartItem = cartItems.find((item: any) => item.id === product.id);
//     const cartQuantity = currentCartItem ? currentCartItem.quantity : 0;

//     const handleAddToCart = (e: React.MouseEvent) => {
//         e.preventDefault();
//         dispatch(addToCart({
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             mrp: product.mrp || product.originalPrice || product.price,
//             image: product.image,
//             category: product.categoryName || 'General'
//         }));
//     };

//     const handleDecreaseQuantity = (e: React.MouseEvent) => {
//         e.preventDefault();
//         if (cartQuantity > 1) {
//             // যদি আপনার স্লাইসে updateQuantity থাকে
//             dispatch(updateQuantity({ id: product.id, quantity: cartQuantity - 1 }));
//         } else {
//             // ১ টা থাকা অবস্থায় মাইনাস চাপলে কার্ট থেকে রিমুভ হবে
//             dispatch(removeFromCart(product.id));
//         }
//     };

//     const handleOrderNow = (e: React.MouseEvent) => {
//         e.preventDefault();
//         // কার্টে যদি অলরেডি না থাকে, তবে অন্তত ১ টা অ্যাড হবে
//         if (cartQuantity === 0) {
//             dispatch(addToCart({
//                 id: product.id,
//                 name: product.name,
//                 price: product.price,
//                 mrp: product.mrp || product.originalPrice || product.price,
//                 image: product.image,
//                 category: product.categoryName || 'General'
//             }));
//         }
//         router.push('/checkout'); 
//     };

//     const handleAddToWishlist = (e: React.MouseEvent) => {
//         e.preventDefault();
//         dispatch(addToWishlist({
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             mrp: product.mrp || product.originalPrice || product.price,
//             image: product.image,
//             category: product.categoryName || 'General',
//             rating: product.rating
//         }));
//     };

//     const currentPrice = product.price;
//     const oldPrice = product.mrp || product.originalPrice;
//     const discountText = product.discount || (oldPrice ? `${Math.round(((oldPrice - currentPrice) / oldPrice) * 100)}%` : null);

//     return (
//         <Link href={`/product/${product.id}`}>
//             <div className='group bg-white border border-gray-100 rounded-md overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 relative flex flex-col h-full'>
//                 {/* Image Container */}
//                 <div className='relative aspect-[4/3] bg-gray-50/50 overflow-hidden'>
//                     {/* Discount Badge */}
//                     {discountText && (
//                         <span className='absolute top-3 left-3 bg-[#EA4335] text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase z-10 tracking-widest leading-none'>
//                             Sale {typeof discountText === 'number' ? `${discountText}%` : discountText}
//                         </span>
//                     )}

//                     {/* Product Image */}
//                     <img
//                         src={product.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800'}
//                         alt={product.name}
//                         className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
//                         onError={(e) => {
//                             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800';
//                         }}
//                     />

//                     {/* Hover Actions */}
//                     <div className='absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500'>
//                         <button
//                             onClick={handleAddToWishlist}
//                             className='w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:bg-[var(--color-primary)] hover:text-white transition-all'
//                         >
//                             <FiHeart size={18} />
//                         </button>
//                         <button className='w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:bg-[var(--color-primary)] hover:text-white transition-all'>
//                             <FiEye size={18} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Product Info */}
//                 <div className='p-3 sm:p-5 pt-4 flex flex-col flex-1 border-t border-gray-50'>
//                     <div className='mb-4'>
//                         <h3 className='text-gray-900 font-bold text-sm group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 mb-2'>
//                             {product.name}
//                         </h3>
                        
//                         {/* Price & Rating Row */}
//                         <div className='flex items-center justify-between gap-2 flex-wrap'>
//                             <div className='flex items-center gap-1.5 flex-wrap'>
//                                 <span className='text-gray-900 font-black text-sm sm:text-base'>৳{currentPrice.toLocaleString()}</span>
//                                 {oldPrice && (
//                                     <span className='text-gray-400 text-xxs sm:text-xs line-through font-medium'>৳{oldPrice.toLocaleString()}</span>
//                                 )}
//                             </div>

//                             {/* Rating */}
//                             <div className='flex items-center gap-0.5 sm:gap-1'>
//                                 <div className='flex text-[#FF8A00]'>
//                                     {[...Array(5)].map((_, i) => (
//                                         <FaStar key={i} size={9} className={i < Math.floor(product.rating) ? 'text-[#FF8A00]' : 'text-gray-200'} />
//                                     ))}
//                                 </div>
//                                 <span className='text-gray-400 text-[9px] sm:text-[10px] font-bold'>({product.reviews})</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Action Buttons (Quantity Selector & Order Now) */}
//                     <div className='flex flex-col xl:flex-row gap-2 mt-auto pt-3 border-t border-gray-50 w-full'>
                        
//                         {/* Dynamic Add to Cart / Quantity Selector */}
//                         <div className='flex-1 h-9 sm:h-10 min-w-0'>
//                             {cartQuantity === 0 ? (
//                                 // যদি কার্টে প্রোডাক্ট না থাকে - সাধারণ Add to Cart বাটন দেখাবে
//                                 <button
//                                     onClick={handleAddToCart}
//                                     className='w-full h-full bg-gray-100 text-gray-900 font-bold text-xs rounded-md flex items-center justify-center gap-1 px-2 hover:bg-gray-900 hover:text-white transition-all active:scale-95 py-1  whitespace-nowrap'
//                                 >
//                                     <FiPlus size={14} className="flex-shrink-0" />
//                                     <span>Add to Cart</span>
//                                 </button>
//                             ) : (
//                                 // যদি কার্টে প্রোডাক্ট অলরেডি থাকে - চালডাল স্টাইল প্লাস-মাইনাস কাউন্টার দেখাবে
//                                 <div className='w-full h-full border border-[var(--color-primary,#FF8A00)] rounded-md flex items-center justify-between overflow-hidden bg-white shadow-sm'>
//                                     <button
//                                         onClick={handleDecreaseQuantity}
//                                         className='h-full px-3 text-[var(--color-primary,#FF8A00)] hover:bg-[var(--color-primary)]/10 flex items-center justify-center transition-colors  py-1  active:scale-90'
//                                     >
//                                         <FiMinus size={14} className="font-black" />
//                                     </button>
                                    
//                                     <span className='font-black text-sm text-gray-900 select-none'>
//                                         {cartQuantity}
//                                     </span>
                                    
//                                     <button
//                                         onClick={handleAddToCart}
//                                         className='h-full px-3 text-[var(--color-primary,#FF8A00)] hover:bg-[var(--color-primary)]/10 flex items-center justify-center transition-colors active:scale-90 py-1 '
//                                     >
//                                         <FiPlus size={14} className="font-black" />
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Order Now Button */}
//                         <button
//                             onClick={handleOrderNow}
//                             className='flex-1 h-9 sm:h-10 bg-[var(--color-primary,#FF8A00)] text-white font-bold text-xs rounded-md flex items-center justify-center gap-1 py-1  px-2 hover:brightness-110 transition-all active:scale-95 shadow-sm whitespace-nowrap'
//                         >
//                             <FiZap size={13} className="flex-shrink-0" />
//                             <span className="truncate">Order Now</span>
//                         </button>
                   
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// };

// export default ProductCard;






"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiHeart, FiEye, FiZap, FiPlus, FiMinus } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux';
import { addToCart, removeFromCart, updateQuantity } from '@/redux/slices/cartSlice';
import { addToWishlist } from '@/redux/slices/wishlistSlice';

interface ProductCardProps {
  product: any;
  onClick?: () => void; // Quick-view (modal) open korar jonno — Eye icon e bosano
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    // ডাটাবেজ থেকে আসা ডাটা অনুযায়ী ভ্যালু ক্যালকুলেশন
    const productId = product?._id;
    const regularPrice = product?.regularPrice || 0;
    const salePrice = product?.salePrice || 0;

    // কারেন্ট প্রাইস এবং ওল্ড প্রাইস নির্ধারণ
    const currentPrice = salePrice > 0 ? salePrice : regularPrice;
    const oldPrice = salePrice > 0 ? regularPrice : null;

    // ইমেজ এবং ক্যাটাগরি
    const productImage = product?.thumbnail || product?.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800';
    const categoryName = product?.categoryID?.name || 'General';

    // Redux স্টেট থেকে কার্ট চেক (id ব্যবহার করে)
    const cartItems = useSelector((state: any) => state.cart.items || []);
    const currentCartItem = cartItems.find((item: any) => item.id === productId);
    const cartQuantity = currentCartItem ? currentCartItem.quantity : 0;

    // হ্যান্ডলার ফাংশনসমূহ
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(addToCart({
            id: productId,
            name: product.name,
            price: currentPrice,
            mrp: regularPrice,
            image: productImage,
            category: categoryName
        }));
    };

    const handleDecreaseQuantity = (e: React.MouseEvent) => {
        e.preventDefault();
        if (cartQuantity > 1) {
            dispatch(updateQuantity({ id: productId, quantity: cartQuantity - 1 }));
        } else {
            dispatch(removeFromCart(productId));
        }
    };

    const handleOrderNow = (e: React.MouseEvent) => {
        e.preventDefault();
        if (cartQuantity === 0) {
            dispatch(addToCart({ id: productId, name: product.name, price: currentPrice, mrp: regularPrice, image: productImage, category: categoryName }));
        }
        router.push('/checkout');
    };

    const handleAddToWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(addToWishlist({
            id: productId,
            name: product.name,
            price: currentPrice,
            mrp: regularPrice,
            image: productImage,
            category: categoryName,
            rating: product.rating || 0
        }));
    };

    // Quick View — Eye icon e click korle modal open hobe, product page e navigate korbe na
    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
    };

    const discountPercent = oldPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : null;

    return (
        <Link href={`/product/${productId}`}>
            <div className='group bg-white border border-gray-100 rounded-md overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 relative flex flex-col h-full'>
                <div className='relative aspect-[4/3] bg-gray-50/50 overflow-hidden'>
                    {discountPercent && (
                        <span className='absolute top-3 left-3 bg-[#EA4335] text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase z-10 tracking-widest leading-none'>
                            Sale {discountPercent}%
                        </span>
                    )}

                    <img
                        src={productImage}
                        alt={product.name}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                    />

                    <div className='absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500'>
                        <button onClick={handleAddToWishlist} className='w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:bg-[var(--color-primary)] hover:text-white transition-all'>
                            <FiHeart size={18} />
                        </button>
                        {/* Eye icon = Quick View => opens ProductModal */}
                        <button onClick={handleQuickView} className='w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-md shadow-sm flex items-center justify-center text-gray-700 hover:bg-[var(--color-primary)] hover:text-white transition-all'>
                            <FiEye size={18} />
                        </button>
                    </div>
                </div>

                <div className='p-3 sm:p-5 pt-4 flex flex-col flex-1 border-t border-gray-50'>
                    <div className='mb-4'>
                        <h3 className='text-gray-900 font-bold text-sm group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 mb-2'>
                            {product.name}
                        </h3>

                        <div className='flex items-center justify-between gap-2 flex-wrap'>
                            <div className='flex items-center gap-1.5 flex-wrap'>
                                <span className='text-gray-900 font-black text-sm sm:text-base'>৳{typeof currentPrice === 'number' ? currentPrice.toLocaleString() : '0'}</span>
                                {oldPrice && (
                                    <span className='text-gray-400 text-xxs sm:text-xs line-through font-medium'>৳{oldPrice.toLocaleString()}</span>
                                )}
                            </div>

                            <div className='flex items-center gap-0.5 sm:gap-1'>
                                <div className='flex text-[#FF8A00]'>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} size={9} className={i < Math.floor(product.rating || 0) ? 'text-[#FF8A00]' : 'text-gray-200'} />
                                    ))}
                                </div>
                                <span className='text-gray-400 text-[9px] sm:text-[10px] font-bold'>({product.numReviews || 0})</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col xl:flex-row gap-2 mt-auto pt-3 border-t border-gray-50 w-full'>
                        <div className='flex-1 h-9 sm:h-10 min-w-0'>
                            {cartQuantity === 0 ? (
                                <button onClick={handleAddToCart} className='w-full h-full bg-gray-100 text-gray-900 font-bold text-xs rounded-md flex items-center justify-center gap-1 px-2 hover:bg-gray-900 hover:text-white transition-all active:scale-95 py-1 whitespace-nowrap'>
                                    <FiPlus size={14} className="flex-shrink-0" />
                                    <span>Add to Cart</span>
                                </button>
                            ) : (
                                <div className='w-full h-full border border-[var(--color-primary,#FF8A00)] rounded-md flex items-center justify-between overflow-hidden bg-white shadow-sm'>
                                    <button onClick={handleDecreaseQuantity} className='h-full px-3 text-[var(--color-primary,#FF8A00)] hover:bg-[var(--color-primary)]/10 flex items-center justify-center transition-colors py-1 active:scale-90'>
                                        <FiMinus size={14} className="font-black" />
                                    </button>
                                    <span className='font-black text-sm text-gray-900 select-none'>{cartQuantity}</span>
                                    <button onClick={handleAddToCart} className='h-full px-3 text-[var(--color-primary,#FF8A00)] hover:bg-[var(--color-primary)]/10 flex items-center justify-center transition-colors active:scale-90 py-1'>
                                        <FiPlus size={14} className="font-black" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button onClick={handleOrderNow} className='flex-1 h-9 sm:h-10 bg-[var(--color-primary,#FF8A00)] text-white font-bold text-xs rounded-md flex items-center justify-center gap-1 py-1 px-2 hover:brightness-110 transition-all active:scale-95 shadow-sm whitespace-nowrap'>
                            <FiZap size={13} className="flex-shrink-0" />
                            <span className="truncate">Order Now</span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
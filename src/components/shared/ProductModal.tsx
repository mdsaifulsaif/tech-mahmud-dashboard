"use client";

import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiX, FiHeart, FiShoppingCart, FiZap, FiChevronLeft, FiChevronRight, FiMinus, FiPlus } from 'react-icons/fi';

/* ---------- Types (matches the API response you shared) ---------- */

interface Variant {
    _id: string;
    weightOrVolume: number;
    unitID: string;
    costPrice: number;
    regularPrice: number;
    salePrice: number;
    stock: number;
    sku?: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export interface Product {
    _id: string;
    name: string;
    shortDescription?: string;
    description?: string;
    categoryID?: Category;
    regularPrice: number;
    salePrice: number;
    discountPercent: number;
    stock: number;
    productType: 'single' | 'combo' | string;
    unit?: string | null;
    weightOrVolume?: number;
    variants: Variant[];
    thumbnail: string;
    images: string[];
    rating?: number;
    numReviews?: number;
}

interface ProductModalProps {
    product: Product;
    relatedProducts?: Product[];
    onClose: () => void;
    onAddToCart?: (product: Product, variant: Variant | null, quantity: number) => void;
    onBuyNow?: (product: Product, variant: Variant | null, quantity: number) => void;
    onAddRelated?: (product: Product) => void;       // qty 0 -> 1 (or +1)
    onDecreaseRelated?: (product: Product) => void;   // -1 (or remove)
}

/* ---------- Helpers ---------- */

const formatTk = (n: number) => `৳${n.toLocaleString()}`;

const getDisplayPrice = (product: Product, variant: Variant | null) => {
    if (variant) {
        return { price: variant.salePrice || variant.regularPrice, mrp: variant.regularPrice };
    }
    const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;
    return { price, mrp: product.regularPrice };
};

/* ---------- Component ---------- */

const ProductModal: React.FC<ProductModalProps> = ({
    product,
    relatedProducts = [],
    onClose,
    onAddToCart,
    onBuyNow,
    onAddRelated,
    onDecreaseRelated,
}) => {
    // Read live cart state so related-product badges reflect actual quantity in cart
    const cartItems = useSelector((state: any) => state.cart?.items || []);
    const getCartQty = (id: string) => {
        const found = cartItems.find((it: any) => it.id === id);
        return found ? found.quantity : 0;
    };

    const hasVariants = product.variants && product.variants.length > 0;
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        hasVariants ? product.variants[0] : null
    );
    const [quantity, setQuantity] = useState(1);

    // Gallery only shows if there are extra images besides the thumbnail
    const galleryImages = useMemo(() => {
        const imgs = product.images && product.images.length > 0 ? product.images : [];
        return imgs.length > 0 ? imgs : [product.thumbnail];
    }, [product.images, product.thumbnail]);
    const hasGallery = product.images && product.images.length > 0;

    const [activeImage, setActiveImage] = useState(0);

    const { price, mrp } = getDisplayPrice(product, selectedVariant);
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const inStock = selectedVariant ? selectedVariant.stock > 0 : product.stock > 0;

    return (
        <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center bg-black/50 p-0 md:p-6 overflow-y-auto">
            <div
                className="relative w-full md:max-w-5xl bg-white rounded-none md:rounded-2xl shadow-2xl my-0 md:my-auto"
                style={{ background: 'var(--color-background)' }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                    aria-label="Close"
                >
                    <FiX size={22} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                    {/* ---------------- Left: Image / Gallery ---------------- */}
                    <div>
                        <div
                            className="w-full aspect-square rounded-xl overflow-hidden border flex items-center justify-center"
                            style={{ borderColor: 'var(--color-surface)', background: 'var(--color-surface)' }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={galleryImages[activeImage]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Gallery thumbnails — only rendered if product has images[] */}
                        {hasGallery && galleryImages.length > 1 && (
                            <div className="flex items-center gap-2 mt-3">
                                <button
                                    onClick={() => setActiveImage((i) => Math.max(0, i - 1))}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border flex-shrink-0"
                                    style={{ borderColor: 'var(--color-surface)' }}
                                >
                                    <FiChevronLeft size={16} />
                                </button>
                                <div className="flex gap-2 overflow-x-auto">
                                    {galleryImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2"
                                            style={{
                                                borderColor:
                                                    activeImage === idx
                                                        ? 'var(--color-primary)'
                                                        : 'var(--color-surface)',
                                            }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() =>
                                        setActiveImage((i) => Math.min(galleryImages.length - 1, i + 1))
                                    }
                                    className="w-8 h-8 flex items-center justify-center rounded-full border flex-shrink-0"
                                    style={{ borderColor: 'var(--color-surface)' }}
                                >
                                    <FiChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ---------------- Right: Details ---------------- */}
                    <div className="flex flex-col">
                        {product.categoryID?.name && (
                            <p className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                                {product.categoryID.name}
                            </p>
                        )}

                        <h2
                            className="text-2xl font-bold mt-1 pr-8"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            {product.name}
                        </h2>

                        {(product.rating ?? 0) > 0 && (
                            <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                <span style={{ color: 'var(--color-secondary)' }}>
                                    {'★'.repeat(Math.round(product.rating || 0))}
                                    {'☆'.repeat(5 - Math.round(product.rating || 0))}
                                </span>
                                <span>{product.rating} ({product.numReviews ?? 0} reviews)</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-3 mt-4">
                            <span className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                {formatTk(price)}
                            </span>
                            {mrp > price && (
                                <>
                                    <span
                                        className="text-lg line-through"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        {formatTk(mrp)}
                                    </span>
                                    <span
                                        className="text-xs font-semibold px-2 py-1 rounded-full"
                                        style={{ background: 'var(--color-error)', color: 'var(--color-background)' }}
                                    >
                                        -{discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Variants — only rendered if variants[] is non-empty */}
                        {hasVariants && (
                            <div className="mt-5">
                                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                                    Weight / Size
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((v) => {
                                        const active = selectedVariant?._id === v._id;
                                        return (
                                            <button
                                                key={v._id}
                                                onClick={() => setSelectedVariant(v)}
                                                disabled={v.stock === 0}
                                                className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                style={{
                                                    borderColor: active ? 'var(--color-primary)' : 'var(--color-surface)',
                                                    background: active ? 'var(--color-primary)' : 'transparent',
                                                    color: active ? 'var(--color-background)' : 'var(--color-text-primary)',
                                                }}
                                            >
                                                {v.weightOrVolume} kg
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mt-5">
                            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                                Quantity
                            </p>
                            <div
                                className="inline-flex items-center border rounded-lg"
                                style={{ borderColor: 'var(--color-surface)' }}
                            >
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-lg"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                >
                                    −
                                </button>
                                <span className="w-10 text-center font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="w-10 h-10 flex items-center justify-center text-lg"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        {product.shortDescription && (
                            <div className="mt-5">
                                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                                    Product Description
                                </p>
                                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
                                    {product.shortDescription}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-6">
                            <button
                                disabled={!inStock}
                                onClick={() => onAddToCart?.(product, selectedVariant, quantity)}
                                className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: 'var(--color-primary)', color: 'var(--color-background)' }}
                            >
                                <FiShoppingCart size={18} />
                                {inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button
                                disabled={!inStock}
                                onClick={() => onBuyNow?.(product, selectedVariant, quantity)}
                                className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                            >
                                <FiZap size={18} />
                                Buy Now
                            </button>
                            <button
                                className="w-12 h-12 flex items-center justify-center rounded-xl border flex-shrink-0"
                                style={{ borderColor: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}
                                aria-label="Wishlist"
                            >
                                <FiHeart size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ---------------- Related Products ---------------- */}
                {relatedProducts.length > 0 && (
                    <div className="px-6 md:px-8 pb-8 pt-2 border-t mt-4" style={{ borderColor: 'var(--color-surface)' }}>
                        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                            You May Also Like
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {relatedProducts.map((rp) => {
                                const rpPrice = rp.salePrice && rp.salePrice > 0 ? rp.salePrice : rp.regularPrice;
                                const qty = getCartQty(rp._id);
                                return (
                                    <div
                                        key={rp._id}
                                        className="border rounded-xl p-3 relative hover:shadow-md transition-shadow"
                                        style={{ borderColor: 'var(--color-surface)' }}
                                    >
                                        <div className="w-full aspect-square rounded-lg overflow-hidden mb-2" style={{ background: 'var(--color-surface)' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={rp.thumbnail} alt={rp.name} className="w-full h-full object-contain" />
                                        </div>

                                        {/* Qty control — shows "+" when not in cart, stepper when it is */}
                                        {qty === 0 ? (
                                            <button
                                                onClick={() => onAddRelated?.(rp)}
                                                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white"
                                                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                                                aria-label="Add to cart"
                                            >
                                                <FiPlus size={16} />
                                            </button>
                                        ) : (
                                            <div
                                                className="absolute top-2 right-2 flex items-center rounded-full border-2 bg-white overflow-hidden"
                                                style={{ borderColor: 'var(--color-primary)' }}
                                            >
                                                <button
                                                    onClick={() => onDecreaseRelated?.(rp)}
                                                    className="w-7 h-7 flex items-center justify-center"
                                                    style={{ color: 'var(--color-primary)' }}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <FiMinus size={13} />
                                                </button>
                                                <span
                                                    className="px-1 text-sm font-bold min-w-[16px] text-center"
                                                    style={{ color: 'var(--color-primary)' }}
                                                >
                                                    {qty}
                                                </span>
                                                <button
                                                    onClick={() => onAddRelated?.(rp)}
                                                    className="w-7 h-7 flex items-center justify-center"
                                                    style={{ color: 'var(--color-primary)' }}
                                                    aria-label="Increase quantity"
                                                >
                                                    <FiPlus size={13} />
                                                </button>
                                            </div>
                                        )}

                                        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                            {formatTk(rpPrice)}
                                        </p>
                                        <p className="text-xs line-clamp-2 mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                                            {rp.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductModal;
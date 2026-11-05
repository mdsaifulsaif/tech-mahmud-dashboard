// "use client";

// import React, { useMemo, useState } from "react";
// import { FiX, FiPlus, FiTrash2, FiSearch, FiSave, FiUser, FiMapPin } from "react-icons/fi";

// import { useGetAllAreasQuery } from "@/redux/api/areaApi";
// import { useCreateOrderAdminMutation } from "@/redux/api/orderApi";
// import { toast } from "react-hot-toast";
// import { useGetProductsQuery } from "@/redux/api/productApi";

// interface Props {
//   onClose: () => void;
// }

// interface CartItem {
//   productID: string;
//   variantID?: string;
//   name: string;
//   thumbnail: string;
//   unitPrice: number;
//   salePrice?: number;
//   quantity: number;
// }

// const inputClass =
//   "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all";

// export default function CreateOrderModal({ onClose }: Props) {
//   const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({});
//   const { data: areasResponse, isLoading: isLoadingAreas } = useGetAllAreasQuery({});
//   const [createOrderAdmin, { isLoading: isSaving }] = useCreateOrderAdminMutation();

//   // ✅ response shape defensive — আপনার actual API shape অনুযায়ী adjust করুন
//   const allProducts: any[] = productsData?.data?.products ?? productsData?.data ?? [];
//   const areas = (areasResponse?.data || []).filter((a: any) => a.isActive);

//   const [productSearch, setProductSearch] = useState("");
//   const [cart, setCart] = useState<CartItem[]>([]);

//   const [customer, setCustomer] = useState({
//     name: "",
//     phone: "",
//   });

//   const [deliveryType, setDeliveryType] = useState<"local" | "nationwide">("local");
//   const [address, setAddress] = useState({
//     area: "",
//     district: "",
//     upazila: "",
//     houseNo: "",
//     road: "",
//     flatNo: "",
//     deliveryNotes: "",
//   });

//   const [paymentMethod, setPaymentMethod] = useState("cod");
//   const [paymentStatus, setPaymentStatus] = useState("unpaid");
//   const [specialInstructions, setSpecialInstructions] = useState("");
//   const [manualShipping, setManualShipping] = useState<string>("");

//   // ✅ Client-side নাম দিয়ে filter
//   const filteredProducts = useMemo(() => {
//     if (!productSearch.trim()) return [];
//     return allProducts
//       .filter((p: any) => p.name?.toLowerCase().includes(productSearch.toLowerCase()))
//       .slice(0, 8);
//   }, [productSearch, allProducts]);

//   const addToCart = (product: any) => {
//     const existing = cart.find((c) => c.productID === product._id);
//     if (existing) {
//       setCart((prev) =>
//         prev.map((c) =>
//           c.productID === product._id ? { ...c, quantity: c.quantity + 1 } : c,
//         ),
//       );
//     } else {
//       setCart((prev) => [
//         ...prev,
//         {
//           productID: product._id,
//           name: product.name,
//           thumbnail: product.thumbnail,
//           unitPrice: product.regularPrice,
//           salePrice: product.salePrice,
//           quantity: 1,
//         },
//       ]);
//     }
//     setProductSearch("");
//   };

//   const updateQuantity = (productID: string, quantity: number) => {
//     if (quantity < 1) return;
//     setCart((prev) =>
//       prev.map((c) => (c.productID === productID ? { ...c, quantity } : c)),
//     );
//   };

//   const removeFromCart = (productID: string) => {
//     setCart((prev) => prev.filter((c) => c.productID !== productID));
//   };

//   const subtotal = cart.reduce((sum, item) => {
//     const price = item.salePrice && item.salePrice > 0 ? item.salePrice : item.unitPrice;
//     return sum + price * item.quantity;
//   }, 0);

//   const shippingCharge = manualShipping !== "" ? Number(manualShipping) : 0;
//   const grandTotal = subtotal + shippingCharge;

//   const handleSubmit = async () => {
//     if (cart.length === 0) {
//       toast.error("অন্তত একটা প্রোডাক্ট যোগ করুন");
//       return;
//     }
//     if (!customer.name || !customer.phone) {
//       toast.error("কাস্টমারের নাম ও ফোন নম্বর দিন");
//       return;
//     }
//     if (deliveryType === "local" && !address.area) {
//       toast.error("Delivery area সিলেক্ট করুন");
//       return;
//     }

//     try {
//       await createOrderAdmin({
//         items: cart.map((c) => ({
//           productID: c.productID,
//           variantID: c.variantID || undefined,
//           quantity: c.quantity,
//         })),
//         customerName: customer.name,
//         customerPhone: customer.phone,
//         deliveryType,
//         deliveryAddress: {
//           area: address.area || undefined,
//           district: address.district || undefined,
//           upazila: address.upazila || undefined,
//           houseNo: address.houseNo || undefined,
//           road: address.road || undefined,
//           flatNo: address.flatNo || undefined,
//           deliveryNotes: address.deliveryNotes || undefined,
//         },
//         paymentMethod,
//         paymentStatus,
//         specialInstructions: specialInstructions || undefined,
//         shippingCharge: manualShipping !== "" ? Number(manualShipping) : undefined,
//       }).unwrap();

//       toast.success("Order created successfully");
//       onClose();
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to create order");
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
//           <h2 className="text-lg font-bold text-gray-800">Create New Order</h2>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
//           >
//             <FiX size={20} />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Product Search */}
//           <section>
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
//               Add Products
//             </h3>
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//               <input
//                 value={productSearch}
//                 onChange={(e) => setProductSearch(e.target.value)}
//                 placeholder="Product নাম লিখে খুঁজুন..."
//                 className={`${inputClass} pl-9`}
//                 disabled={isLoadingProducts}
//               />
//               {filteredProducts.length > 0 && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                   {filteredProducts.map((p: any) => (
//                     <button
//                       key={p._id}
//                       type="button"
//                       onClick={() => addToCart(p)}
//                       className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-left transition-all"
//                     >
//                       <img
//                         src={p.thumbnail}
//                         alt={p.name}
//                         className="w-10 h-10 rounded-md object-contain border border-gray-100 flex-shrink-0"
//                       />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
//                         <p className="text-xs text-gray-400">
//                           ৳{p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice}
//                         </p>
//                       </div>
//                       <FiPlus size={16} className="text-[#2563EB] flex-shrink-0" />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Cart items */}
//             {cart.length > 0 && (
//               <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
//                 {cart.map((item) => (
//                   <div
//                     key={item.productID}
//                     className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0"
//                   >
//                     <img
//                       src={item.thumbnail}
//                       alt={item.name}
//                       className="w-12 h-12 rounded-md object-contain border border-gray-100 flex-shrink-0"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
//                       <p className="text-xs text-gray-400">
//                         ৳{item.salePrice && item.salePrice > 0 ? item.salePrice : item.unitPrice} × {item.quantity}
//                       </p>
//                     </div>
//                     <input
//                       type="number"
//                       min={1}
//                       value={item.quantity}
//                       onChange={(e) => updateQuantity(item.productID, Number(e.target.value))}
//                       className="w-16 px-2 py-1.5 border border-gray-200 rounded-md text-sm text-center"
//                     />
//                     <p className="text-sm font-bold text-gray-800 w-20 text-right">
//                       ৳
//                       {(
//                         (item.salePrice && item.salePrice > 0 ? item.salePrice : item.unitPrice) *
//                         item.quantity
//                       ).toLocaleString()}
//                     </p>
//                     <button
//                       onClick={() => removeFromCart(item.productID)}
//                       className="p-1.5 text-gray-400 hover:text-red-500 transition-all"
//                     >
//                       <FiTrash2 size={15} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>

//           {/* Customer Info */}
//           <section>
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
//               <FiUser size={13} /> Customer Info
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 placeholder="Customer Name"
//                 value={customer.name}
//                 onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
//                 className={inputClass}
//               />
//               <input
//                 placeholder="Phone Number"
//                 value={customer.phone}
//                 onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
//                 className={inputClass}
//               />
//             </div>
//           </section>

//           {/* Delivery */}
//           <section>
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
//               <FiMapPin size={13} /> Delivery Address
//             </h3>

//             <div className="flex gap-2 mb-3">
//               {(["local", "nationwide"] as const).map((t) => (
//                 <button
//                   key={t}
//                   type="button"
//                   onClick={() => setDeliveryType(t)}
//                   className={`px-4 py-2 rounded-lg text-xs font-semibold border capitalize transition-all ${
//                     deliveryType === t
//                       ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]"
//                       : "border-gray-200 text-gray-500"
//                   }`}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>

//             {deliveryType === "local" ? (
//               <select
//                 value={address.area}
//                 onChange={(e) => setAddress({ ...address, area: e.target.value })}
//                 className={`${inputClass} mb-3`}
//                 disabled={isLoadingAreas}
//               >
//                 <option value="">{isLoadingAreas ? "Loading..." : "Select Area"}</option>
//                 {areas.map((a: any) => (
//                   <option key={a._id} value={a._id}>
//                     {a.name}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <div className="grid grid-cols-2 gap-3 mb-3">
//                 <input
//                   placeholder="District"
//                   value={address.district}
//                   onChange={(e) => setAddress({ ...address, district: e.target.value })}
//                   className={inputClass}
//                 />
//                 <input
//                   placeholder="Upazila"
//                   value={address.upazila}
//                   onChange={(e) => setAddress({ ...address, upazila: e.target.value })}
//                   className={inputClass}
//                 />
//               </div>
//             )}

//             <div className="grid grid-cols-3 gap-3">
//               <input
//                 placeholder="House No"
//                 value={address.houseNo}
//                 onChange={(e) => setAddress({ ...address, houseNo: e.target.value })}
//                 className={inputClass}
//               />
//               <input
//                 placeholder="Road"
//                 value={address.road}
//                 onChange={(e) => setAddress({ ...address, road: e.target.value })}
//                 className={inputClass}
//               />
//               <input
//                 placeholder="Flat No"
//                 value={address.flatNo}
//                 onChange={(e) => setAddress({ ...address, flatNo: e.target.value })}
//                 className={inputClass}
//               />
//             </div>
//           </section>

//           {/* Payment */}
//           <section>
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
//               Payment
//             </h3>
//             <div className="grid grid-cols-3 gap-4">
//               <select
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className={inputClass}
//               >
//                 <option value="cod">Cash on Delivery</option>
//                 <option value="bkash">bKash</option>
//                 <option value="nagad">Nagad</option>
//                 <option value="card">Card</option>
//                 <option value="bank">Bank</option>
//               </select>
//               <select
//                 value={paymentStatus}
//                 onChange={(e) => setPaymentStatus(e.target.value)}
//                 className={inputClass}
//               >
//                 <option value="unpaid">Unpaid</option>
//                 <option value="paid">Paid</option>
//                 <option value="refunded">Refunded</option>
//               </select>
//               <input
//                 type="number"
//                 placeholder="Shipping Charge (৳)"
//                 value={manualShipping}
//                 onChange={(e) => setManualShipping(e.target.value)}
//                 className={inputClass}
//                 min={0}
//               />
//             </div>
//           </section>

//           <div>
//             <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
//               Special Instructions
//             </label>
//             <textarea
//               value={specialInstructions}
//               onChange={(e) => setSpecialInstructions(e.target.value)}
//               rows={2}
//               className={`${inputClass} resize-none`}
//             />
//           </div>

//           {/* Summary */}
//           <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-500">Subtotal</span>
//               <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-500">Shipping</span>
//               <span className="font-semibold">৳{shippingCharge.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between pt-2 border-t border-gray-200">
//               <span className="font-bold text-gray-800">Total</span>
//               <span className="font-bold text-gray-800">৳{grandTotal.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
//           <button
//             onClick={onClose}
//             className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isSaving}
//             className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60"
//           >
//             {isSaving ? (
//               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//             ) : (
//               <FiSave size={15} />
//             )}
//             Create Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import React, { useMemo, useState } from "react";
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiSearch,
  FiSave,
  FiUser,
  FiUserCheck,
  FiMapPin,
} from "react-icons/fi";
// import { useGetAllProductsQuery } from "@/redux/api/productApi"; // ⚠️ আপনার actual hook নাম দিয়ে বদলান
import { useGetAllAreasQuery } from "@/redux/api/areaApi";
// import { useGetShippingPreviewQuery } from "@/redux/api/shippingApi";
// import { useSearchUsersQuery } from "@/redux/api/userApi";
import { useCreateOrderAdminMutation } from "@/redux/api/orderApi";
import { toast } from "react-hot-toast";
import { useGetProductsQuery } from "@/redux/api/productApi";
import { useSearchUsersQuery } from "@/redux/api/authApi";
import { useGetShippingPreviewQuery } from "@/redux/api/shippingApi";

interface Props {
  onClose: () => void;
}

interface CartItem {
  productID: string;
  variantID?: string;
  name: string;
  thumbnail: string;
  unitPrice: number;
  salePrice?: number;
  quantity: number;
}

const inputClass =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all";

export default function CreateOrderModal({ onClose }: Props) {
  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({});
  const { data: areasResponse, isLoading: isLoadingAreas } = useGetAllAreasQuery({});
  const [createOrderAdmin, { isLoading: isSaving }] = useCreateOrderAdminMutation();

  const allProducts: any[] = productsData?.data?.products ?? productsData?.data ?? [];
  const areas = (areasResponse?.data || []).filter((a: any) => a.isActive);

  // ===== Product search & cart =====
  const [productSearch, setProductSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return [];
    return allProducts
      .filter((p: any) => p.name?.toLowerCase().includes(productSearch.toLowerCase()))
      .slice(0, 8);
  }, [productSearch, allProducts]);

  const addToCart = (product: any) => {
    const existing = cart.find((c) => c.productID === product._id);
    if (existing) {
      setCart((prev) =>
        prev.map((c) =>
          c.productID === product._id ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          productID: product._id,
          name: product.name,
          thumbnail: product.thumbnail,
          unitPrice: product.regularPrice,
          salePrice: product.salePrice,
          quantity: 1,
        },
      ]);
    }
    setProductSearch("");
  };

  const updateQuantity = (productID: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => prev.map((c) => (c.productID === productID ? { ...c, quantity } : c)));
  };

  const removeFromCart = (productID: string) => {
    setCart((prev) => prev.filter((c) => c.productID !== productID));
  };

  // ===== Customer search =====
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [customer, setCustomer] = useState({ name: "", phone: "" });

  const { data: searchResults, isFetching: isSearchingUsers } = useSearchUsersQuery(
    customerSearch,
    { skip: customerSearch.trim().length < 2 },
  );
  const foundUsers = searchResults?.data || [];

  // ===== Delivery =====
  const [deliveryType, setDeliveryType] = useState<"local" | "nationwide">("local");
  const [address, setAddress] = useState({
    area: "",
    district: "",
    upazila: "",
    houseNo: "",
    road: "",
    flatNo: "",
    deliveryNotes: "",
  });

  // ===== Payment =====
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // ===== Dynamic Shipping (DB tiers থেকে, checkout page-এর মতোই) =====
  const [manualShippingOverride, setManualShippingOverride] = useState<string>("");

  const subtotal = cart.reduce((sum, item) => {
    const price = item.salePrice && item.salePrice > 0 ? item.salePrice : item.unitPrice;
    return sum + price * item.quantity;
  }, 0);

  const { data: shippingPreview, isFetching: isShippingLoading } = useGetShippingPreviewQuery(
    { deliveryType, subtotal },
    { skip: !subtotal || manualShippingOverride !== "" },
  );

  // ✅ Manual override দিলে সেটা, নাহলে dynamic preview থেকে আসা charge
  const dynamicShipping = shippingPreview?.data?.shippingCharge ?? 0;
  const shippingCharge =
    manualShippingOverride !== "" ? Number(manualShippingOverride) : dynamicShipping;

  const grandTotal = subtotal + shippingCharge;

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast.error("অন্তত একটা প্রোডাক্ট যোগ করুন");
      return;
    }
    if (!customer.name || !customer.phone) {
      toast.error("কাস্টমারের নাম ও ফোন নম্বর দিন");
      return;
    }
    if (deliveryType === "local" && !address.area) {
      toast.error("Delivery area সিলেক্ট করুন");
      return;
    }

    try {
      await createOrderAdmin({
        userID: selectedUser?._id || undefined,
        items: cart.map((c) => ({
          productID: c.productID,
          variantID: c.variantID || undefined,
          quantity: c.quantity,
        })),
        customerName: customer.name,
        customerPhone: customer.phone,
        deliveryType,
        deliveryAddress: {
          area: deliveryType === "local" ? address.area || undefined : undefined,
          district: deliveryType === "nationwide" ? address.district || undefined : undefined,
          upazila: deliveryType === "nationwide" ? address.upazila || undefined : undefined,
          houseNo: address.houseNo || undefined,
          road: address.road || undefined,
          flatNo: address.flatNo || undefined,
          deliveryNotes: address.deliveryNotes || undefined,
        },
        paymentMethod,
        paymentStatus,
        specialInstructions: specialInstructions || undefined,
        shippingCharge: manualShippingOverride !== "" ? Number(manualShippingOverride) : undefined,
      }).unwrap();

      toast.success("Order created successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create order");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-800">Create New Order</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ===== Products ===== */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Add Products
            </h3>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Product নাম লিখে খুঁজুন..."
                className={`${inputClass} pl-9`}
                disabled={isLoadingProducts}
              />
              {filteredProducts.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.map((p: any) => (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => addToCart(p)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-left transition-all"
                    >
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        className="w-10 h-10 rounded-md object-contain border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">
                          ৳{p.salePrice && p.salePrice > 0 ? p.salePrice : p.regularPrice}
                        </p>
                      </div>
                      <FiPlus size={16} className="text-[#2563EB] flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
                {cart.map((item) => (
                  <div
                    key={item.productID}
                    className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-contain border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        ৳{item.salePrice && item.salePrice > 0 ? item.salePrice : item.unitPrice} ×{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productID, Number(e.target.value))}
                      className="w-16 px-2 py-1.5 border border-gray-200 rounded-md text-sm text-center"
                    />
                    <p className="text-sm font-bold text-gray-800 w-20 text-right">
                      ৳
                      {(
                        (item.salePrice && item.salePrice > 0 ? item.salePrice : item.unitPrice) *
                        item.quantity
                      ).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productID)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ===== Customer ===== */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiUser size={13} /> Customer
            </h3>

            {selectedUser ? (
              <div className="flex items-center justify-between bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-lg px-4 py-3 mb-3">
                <div className="flex items-center gap-2">
                  <FiUserCheck className="text-[#2563EB]" size={16} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedUser.fullName ||
                        `${selectedUser.firstName} ${selectedUser.lastName}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedUser.phoneNumber || selectedUser.email} · Existing customer
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setCustomerSearch("");
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="নাম, ফোন বা ইমেইল দিয়ে existing customer খুঁজুন (ঐচ্ছিক)..."
                  className={`${inputClass} pl-9`}
                />
                {customerSearch.trim().length >= 2 && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {isSearchingUsers ? (
                      <p className="px-4 py-3 text-sm text-gray-400">খোঁজা হচ্ছে...</p>
                    ) : foundUsers.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-gray-400">
                        কোনো existing customer পাওয়া যায়নি — নিচে ম্যানুয়ালি তথ্য দিন
                      </p>
                    ) : (
                      foundUsers.map((u: any) => (
                        <button
                          key={u._id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(u);
                            setCustomer({
                              name: u.fullName || `${u.firstName} ${u.lastName}`,
                              phone: u.phoneNumber || "",
                            });
                            setCustomerSearch("");
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-all"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {u.fullName || `${u.firstName} ${u.lastName}`}
                          </p>
                          <p className="text-xs text-gray-400">
                            {u.phoneNumber || "No phone"} · {u.email}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Customer Name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Phone Number"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className={inputClass}
              />
            </div>
          </section>

          {/* ===== Delivery ===== */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiMapPin size={13} /> Delivery Address
            </h3>

            <div className="flex gap-2 mb-3">
              {(["local", "nationwide"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDeliveryType(t)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border capitalize transition-all ${
                    deliveryType === t
                      ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {deliveryType === "local" ? (
              <select
                value={address.area}
                onChange={(e) => setAddress({ ...address, area: e.target.value })}
                className={`${inputClass} mb-3`}
                disabled={isLoadingAreas}
              >
                <option value="">{isLoadingAreas ? "Loading..." : "Select Area"}</option>
                {areas.map((a: any) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="District"
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  className={inputClass}
                />
                <input
                  placeholder="Upazila"
                  value={address.upazila}
                  onChange={(e) => setAddress({ ...address, upazila: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <input
                placeholder="House No"
                value={address.houseNo}
                onChange={(e) => setAddress({ ...address, houseNo: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Road"
                value={address.road}
                onChange={(e) => setAddress({ ...address, road: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Flat No"
                value={address.flatNo}
                onChange={(e) => setAddress({ ...address, flatNo: e.target.value })}
                className={inputClass}
              />
            </div>
          </section>

          {/* ===== Payment ===== */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Payment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={inputClass}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="card">Card</option>
                <option value="bank">Bank</option>
              </select>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className={inputClass}
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </section>

          {/* ===== Shipping (dynamic, override optional) ===== */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Shipping Charge
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm">
                {isShippingLoading ? (
                  <span className="text-gray-400">হিসাব হচ্ছে...</span>
                ) : (
                  <>
                    Auto (DB tier অনুযায়ী):{" "}
                    <span className="font-bold text-gray-800">৳{dynamicShipping}</span>
                  </>
                )}
              </div>
              <input
                type="number"
                placeholder="Override (৳)"
                value={manualShippingOverride}
                onChange={(e) => setManualShippingOverride(e.target.value)}
                className={`${inputClass} w-40`}
                min={0}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              ফাঁকা রাখলে সিস্টেম DB থেকে automatic charge হিসাব করবে। Override দিলে সেটাই ব্যবহার
              হবে।
            </p>
          </section>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
              Special Instructions
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* ===== Summary ===== */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-semibold">৳{shippingCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-gray-800">৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSave size={15} />
            )}
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}
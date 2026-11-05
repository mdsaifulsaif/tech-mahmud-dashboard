# 🖥️ Tech Mahmud - Admin Dashboard Roadmap & Architecture

> **Project Target:** `tech-mahmud-dashboard` কে একটি আধুনিক, হাই-পারফরম্যান্স **Gadget & Clothing E-Commerce Admin Dashboard** এ রূপান্তর করা।  
> **Design Philosophy:** একটি সমন্বিত ৩-কালার সিস্টেমের (Royal Blue `#2563EB`, Deep Slate `#0F172A`, Clean White `#FFFFFF`) উপর ভিত্তি করে বিশ্বমানের টেক ও ফ্যাশন ইন্টারফেস।  
> **Strict Directive:** সবজিহাট/রাইডার বা গ্রোসারি-নির্দিষ্ট উপাদান ১০০% মুক্ত। মার্কেটিং ও ট্র্যাকিং ফিচার অক্ষত।

---

## 🎨 Unified 3-Color Design System (Strictly Followed)

- **Primary Core:** `#2563EB` (Royal Blue) — প্রধান অ্যাকশন, কেপিআই মেট্রিক্স, সক্রিয় পিল, চার্ট কার্ভ।
- **Dark Neutral Accent:** `#0F172A` / `#1E293B` (Obsidian Deep Slate) — কমান্ড হেডার, সাইডবার, টাইপোগ্রাফি, কাউন্টার।
- **Clean Surface:** `#FFFFFF` & `#F8FAFC` (Slate-50) — বর্ডার `#E2E8F0`, মসৃণ কার্ড ব্যাকগ্রাউন্ড।

---

## 📌 Dashboard Execution Progress

### ✅ Step 1: Global Design Tokens & Clean UI Overhaul (Completed)
- [x] সম্পূর্ণ ড্যাশবোর্ডের গ্রোসারি গ্রিন (`#619d23`, `#5CAF90`, ইত্যাদি) এবং সবজিহাট নাম ৪৭টি ফাইল থেকে পুরোপুরি ক্লিন করা হয়েছে।
- [x] `AdminDashboard.tsx` এর পুরাতন গ্রোসারি লেআউট বাদ দিয়ে সম্পূর্ণ নতুন "Tech Mahmud Command Center" ইউআই তৈরি করা হয়েছে।
- [x] রেইনবো কালার বাদ দিয়ে সর্বোচ্চ ৩টি কো-অর্ডিনেটেড কালার (Royal Blue + Deep Slate + White) বজায় রাখা হয়েছে।

### ✅ Step 2: Admin Navigation Sidebar & Branding (Completed)
- [x] ব্র্যান্ডিং আপডেট: "Tech Mahmud - Gadget & Clothing"।
- [x] রাইডার অপশন এবং অন-ডিমান্ড সবজি সংক্রান্ত লিঙ্ক সম্পূর্ণরূপে অপসারিত।
- [x] সক্রিয় মেনু ও নোটিফিকেশন আইটেমগুলোতে রয়্যাল ব্লু থিম যুক্ত।

### ✅ Step 3: Product Management for Clothing & Gadgets (Completed)
- [x] **Product Type Selector:**
  - `Clothing` (পোশাক) | `Gadget` (গ্যাজেট) | `General` (সাধারণ পণ্য)
- [x] **Clothing Panel (`ClothingAttributesPanel.tsx`):**
  - কালার পিকার ও কালার সোয়াচ ডটস (Hex + Name)
  - সাইজ পিলস সিলেক্টর (XS, S, M, L, XL, XXL, 3XL, 28, 30, 32...)
  - ফ্যাব্রিক ম্যাটেরিয়াল ও ফিট প্রোফাইল (Slim Fit, Regular Fit, Oversized...)
  - সাইজ গাইড চার্ট লিঙ্ক
- [x] **Gadget Panel (`GadgetAttributesPanel.tsx`):**
  - মডেল নম্বর ও রিলিজ ইয়ার
  - অফিসিয়াল/শপ ওয়ারেন্টি টাইপ, সময়কাল ও শর্তাবলি
- [x] **Technical Specifications (`ProductSpecifications.tsx`):**
  - প্রসেসর, র‍্যাম, স্টোরেজ, ডিসপ্লে, ব্যাটারির মতো ১০+ কুইক প্রিসেট কি-ভ্যালু।
- [x] **Pricing Panel (`ProductPricingPanel.tsx`):**
  - গ্রোসারি ইউনিট বাধ্যবাধকতা বাতিল।
  - সাইজ/কালার/স্টোরেজের উপর ভিত্তি করে স্বয়ংক্রিয় ভ্যারিয়েন্ট ম্যাট্রিক্স।

### ✅ Step 4: Order Management & Courier Tracking (Completed)
- [x] রাইডার অ্যাসাইনমেন্টের জায়গায় কুরিয়ার ট্র্যাকিং সিস্টেম (Steadfast, Pathao, RedX, Sundarban ইত্যাদি)।
- [x] টেবিল এবং ডিটেইলস মোডালে কুরিয়ার নেম, ট্র্যাকিং কোড (কপি বাটনসহ), ও নির্বাচিত অ্যাট্রিবিউটস (সাইজ, কালার, স্টোরেজ) ডিসপ্লে।
- [x] `PATCH /order/admin/:id/courier` এপিআই এন্ডপয়েন্ট কানেক্টেড।

### ✅ Step 5: Database Seeding & Testing (Completed)
- [x] অ্যাডমিন ইউজার `admin@gmail.com` (পাসওয়ার্ড: `admin123`) সরাসরি ডাটাবেসে সেইভ ও ভেরিফাই করা হয়েছে।
- [x] `AdminDashboard.tsx` এর রানটাইম টাইপ এরর (`count of undefined`) ১০০% সমাধান করা হয়েছে।
- [x] TypeScript টাইপ চেক (`npx tsc --noEmit`) 0 errors এ পাস করেছে।

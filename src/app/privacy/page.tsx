import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FiChevronRight, FiShield, FiLock, FiMail, FiPhone } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Privacy Policy | Tech Mahmud - Protecting Your Data",
  description:
    "Tech Mahmud's Privacy Policy outlines how we collect, protect, and handle your personal information when using our online grocery delivery service in Barisal, Bangladesh.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="bg-white min-h-screen font-['Poppins']">
      {/* Header */}
      <div className="bg-gray-50/70 border-b border-gray-100 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
              Home
            </Link>
            <FiChevronRight size={14} />
            <span className="text-gray-900">Privacy Policy</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <FiShield size={22} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Privacy <span className="text-[var(--color-primary)]">Policy</span>
            </h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Last Updated: {lastUpdated} • Applies to all users and visitors of Tech Mahmud
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-10 sm:py-14">
        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="bg-gray-50/70 p-6 sm:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">01.</span> Introduction
            </h2>
            <p>
              Welcome to <strong>Tech Mahmud</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, or use our grocery ordering and delivery services in Barisal, Bangladesh.
            </p>
            <p className="mt-3">
              By accessing or using Tech Mahmud, you agree to the collection and use of information in accordance with this policy. If you do not agree with any part of this policy, please refrain from using our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">02.</span> Information We Collect
            </h2>
            <p>We collect information to provide, maintain, and improve our daily grocery delivery operations:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-5 bg-white rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-2">Personal Identification</h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600">
                  <li>Full Name and contact telephone / mobile number</li>
                  <li>Email address (for receipts and account communication)</li>
                  <li>Account login credentials</li>
                </ul>
              </div>
              <div className="p-5 bg-white rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-2">Delivery & Location Information</h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600">
                  <li>Detailed doorstep delivery address & area (e.g., Barisal City wards)</li>
                  <li>Nearby landmarks and specific delivery notes</li>
                  <li>GPS location (optional, with your explicit permission)</li>
                </ul>
              </div>
              <div className="p-5 bg-white rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-2">Order & Payment Data</h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600">
                  <li>Items ordered, quantities, and order history</li>
                  <li>Selected payment method (Cash on Delivery, bKash, Nagad, Card)</li>
                  <li>Transaction reference numbers (We do NOT store payment PINs or card CVVs)</li>
                </ul>
              </div>
              <div className="p-5 bg-white rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-2">Device & Usage Details</h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600">
                  <li>IP address, browser type, and operating system</li>
                  <li>Pages visited, time spent, and referral sources</li>
                  <li>Session cookies to maintain your shopping cart</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">03.</span> How We Use Your Information
            </h2>
            <p>We use the collected information for the following legitimate business purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-600 pl-2">
              <li><strong>Order Processing & Fulfillment:</strong> Preparing, sorting, packing, and dispatching fresh vegetables and groceries to your doorstep.</li>
              <li><strong>Delivery Routing & Communication:</strong> Assigning delivery riders and sending real-time SMS, WhatsApp, or phone updates regarding order status.</li>
              <li><strong>Customer Support:</strong> Responding to inquiries, resolving replacement requests, or processing eligible refunds quickly.</li>
              <li><strong>Personalized Experience:</strong> Recommending frequently purchased kitchen staples and notifying you of seasonal harvests and special promotions.</li>
              <li><strong>Security & Fraud Prevention:</strong> Protecting our platform and customers against fraudulent orders or unauthorized account access.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">04.</span> Sharing of Information
            </h2>
            <p>
              <strong>We never sell, rent, or trade your personal information to third-party marketing companies.</strong> We only share information with trusted parties strictly necessary for our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-600 pl-2">
              <li><strong>Assigned Delivery Riders:</strong> Provided only with your name, phone number, and delivery address to complete your doorstep delivery.</li>
              <li><strong>Payment Service Providers:</strong> Regulated payment gateways (such as bKash, Nagad, SSLCommerz) to process cashless transactions securely.</li>
              <li><strong>Legal Authorities:</strong> When required by Bangladeshi law, judicial proceedings, or to protect the safety and property of Tech Mahmud and our users.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
              <FiLock size={20} />
              <span>05. Data Security & Storage</span>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">
              We employ strict technical and organizational measures to safeguard your personal information:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-700">
              <li>HTTPS and 256-bit SSL encryption across all web traffic.</li>
              <li>Secure cloud databases with strict access-control protocols.</li>
              <li>We never store debit/credit card PINs, passwords, or bKash PINs on our servers.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">06.</span> Cookies & Local Storage
            </h2>
            <p>
              We use standard session cookies and browser local storage to maintain items in your shopping cart, preserve your login session, and understand how visitors interact with our platform. You can configure your browser to reject cookies, but certain features (like your cart memory) may not function properly.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">07.</span> Your Rights & Control
            </h2>
            <p>As a Tech Mahmud customer, you have full control over your data:</p>
            <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-gray-600 pl-2">
              <li><strong>Access & Update:</strong> You can review and update your name, address, and contact details from your Profile page at any time.</li>
              <li><strong>Opt-Out of Marketing:</strong> You may unsubscribe from promotional newsletters and SMS messages at any time.</li>
              <li><strong>Account Deletion:</strong> You may request the permanent deletion of your account and personal records by contacting our support team.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="bg-gray-50/70 p-6 sm:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">08. Contact Our Privacy Team</h2>
            <p className="text-sm text-gray-600 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FiMail className="text-[var(--color-primary)]" />
                <a href="mailto:support@techmahmud.com" className="font-semibold hover:underline">
                  support@techmahmud.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-[var(--color-primary)]" />
                <a href="tel:01783176838" className="font-semibold hover:underline">
                  +880 1783-176838
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FiChevronRight, FiFileText, FiCheckCircle, FiMail, FiPhone } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Terms & Conditions | Tech Mahmud - Online Grocery Delivery",
  description:
    "Read the terms, rules, and conditions for ordering fresh vegetables, fruits, fish, and groceries from Tech Mahmud in Barisal, Bangladesh.",
};

export default function TermsPage() {
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
            <span className="text-gray-900">Terms & Conditions</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <FiFileText size={22} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Terms & <span className="text-[var(--color-primary)]">Conditions</span>
            </h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Last Updated: {lastUpdated} • Please review carefully before placing orders with Tech Mahmud
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-10 sm:py-14">
        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="bg-gray-50/70 p-6 sm:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">01.</span> Agreement to Terms
            </h2>
            <p>
              These Terms & Conditions constitute a legally binding agreement between you (&ldquo;Customer&rdquo;, &ldquo;User&rdquo;) and <strong>Tech Mahmud</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;), governing your access to and use of our website, applications, and doorstep grocery delivery services in Barisal, Bangladesh.
            </p>
            <p className="mt-3">
              By placing an order or registering an account on Tech Mahmud, you acknowledge that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">02.</span> Eligibility & Account Registration
            </h2>
            <p>To use our services, you agree to the following:</p>
            <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-gray-600 pl-2">
              <li>You must be at least 18 years old or place orders under parental/guardian supervision.</li>
              <li>You agree to provide accurate, up-to-date, and complete contact details (active phone number, valid delivery address in Barisal).</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">03.</span> Product Quality, Weights & Daily Pricing
            </h2>
            <p>
              Tech Mahmud specializes in fresh agricultural produce, seafood, meat, and packaged consumer goods:
            </p>
            <div className="space-y-3 mt-3">
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Perishable Weight Tolerances</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Because fresh vegetables, fish, and fruits naturally vary in shape and moisture content, exact fractional weights may differ slightly (within ±5%). We always strive to provide equal or slightly higher weight to ensure fair customer value.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Market-Reflected Pricing</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Vegetable and fruit prices in Bangladesh fluctuate with daily wholesale agricultural markets. The price displayed in your cart at the time of checkout is the final applicable price.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">04.</span> Delivery Policy & Service Area
            </h2>
            <p>
              We currently serve designated zones within <strong>Barisal City</strong> and surrounding areas:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-gray-600 pl-2">
              <li>Orders are delivered to the address provided during checkout. Please ensure access to your building or gated area.</li>
              <li>Delivery time slots (Morning, Afternoon, Evening) are estimated targets. Severe weather, road congestion, or hartals may occasionally cause unavoidable delays.</li>
              <li>Delivery fees are clearly shown at checkout before order finalization.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
              <FiCheckCircle size={20} className="text-amber-600" />
              <span>05. Freshness Guarantee & Doorstep Inspection</span>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">
              We take pride in our 100% fresh produce standard:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-700">
              <li><strong>Check at delivery:</strong> We encourage customers to inspect fresh vegetables and fish upon receiving from the delivery rider.</li>
              <li><strong>Immediate Return:</strong> If any item is unsatisfactory, you may immediately hand it back to the rider without charge.</li>
              <li><strong>24-Hour Perishable Window:</strong> For any spoiled produce discovered after handover, notify our support team with a photo within 24 hours for a full replacement or refund.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">06.</span> Payment Terms & Refunds
            </h2>
            <p>
              We accept multiple payment methods for customer convenience:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-gray-600 pl-2">
              <li><strong>Cash on Delivery (COD):</strong> Pay in cash to the rider upon satisfactory handover.</li>
              <li><strong>Digital Payments:</strong> bKash, Nagad, or debit/credit card via secure gateway SSLCommerz.</li>
              <li><strong>Refund Processing:</strong> Approved digital refunds are credited back to the original funding source within 3-7 business days, in compliance with Bangladesh Bank regulations.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">07.</span> Prohibited Activities
            </h2>
            <p>When using Tech Mahmud, you agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-600 pl-2">
              <li>Place fictitious, abusive, or bulk speculative orders to disrupt operations.</li>
              <li>Harass, threaten, or mistreat our doorstep delivery riders or customer care personnel.</li>
              <li>Attempt to scrape, reverse engineer, or exploit vulnerabilities on our website or servers.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[var(--color-primary)] font-mono text-lg">08.</span> Governing Law
            </h2>
            <p>
              These Terms & Conditions are governed by and construed in accordance with the laws of the People&apos;s Republic of Bangladesh. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts of Barisal, Bangladesh.
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-gray-50/70 p-6 sm:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">09. Contact Information</h2>
            <p className="text-sm text-gray-600 mb-4">
              For any questions regarding these Terms & Conditions or to report a grievance, please contact us:
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

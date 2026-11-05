"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PackageForm from "../_components/PackageForm";
import { useCreateSubscriptionPackageMutation } from "@/redux/api/subscriptionApi";
import toast from "react-hot-toast";

export default function CreateSubscriptionPackagePage() {
  const router = useRouter();
  const [createPackage, { isLoading }] = useCreateSubscriptionPackageMutation();

  const handleCreate = async (payload: any) => {
    try {
      await createPackage(payload).unwrap();
      toast.success("Subscription package created successfully!");
      router.push("/dashboard/admin/subscriptions/packages");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create subscription package");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Create New Subscription Package</h1>
        <p className="text-gray-500 text-sm">
          Add a new weekly/monthly subscription package box with custom items and pricing
        </p>
      </div>

      <PackageForm onSubmit={handleCreate} isLoading={isLoading} />
    </div>
  );
}

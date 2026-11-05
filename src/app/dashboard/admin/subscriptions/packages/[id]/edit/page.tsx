"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import PackageForm from "../../_components/PackageForm";
import {
  useGetSubscriptionPackageByIdQuery,
  useUpdateSubscriptionPackageMutation,
} from "@/redux/api/subscriptionApi";
import toast from "react-hot-toast";

interface EditPackagePageProps {
  params: Promise<{ id: string }>;
}

export default function EditSubscriptionPackagePage({ params }: EditPackagePageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: packageData, isLoading: isFetching } = useGetSubscriptionPackageByIdQuery(id);
  const [updatePackage, { isLoading: isUpdating }] = useUpdateSubscriptionPackageMutation();

  const handleUpdate = async (payload: any) => {
    try {
      await updatePackage({ id, data: payload }).unwrap();
      toast.success("Subscription package updated successfully!");
      router.push("/dashboard/admin/subscriptions/packages");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update package");
    }
  };

  if (isFetching) {
    return <div className="p-12 text-center text-gray-400">Loading package details...</div>;
  }

  if (!packageData?.data) {
    return <div className="p-12 text-center text-red-500">Subscription package not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Edit Subscription Package</h1>
        <p className="text-gray-500 text-sm">
          Update pricing, item contents or homepage visibility for "{packageData.data.name}"
        </p>
      </div>

      <PackageForm
        initialData={packageData.data}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
        isEdit={true}
      />
    </div>
  );
}

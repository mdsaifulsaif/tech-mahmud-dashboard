"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "@/redux/api/productApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetUnitsQuery } from "@/redux/api/unitApi";
import { useGetBrandsQuery } from "@/redux/api/brandApi";
import { toast } from "react-hot-toast";
import { cleanSlug } from "@/lib/slugify";

import ProductFormHeader from "../_components/ProductFormHeader";
import ProductTypeToggle from "../_components/ProductTypeToggle";
import ProductBasicInfo from "../_components/ProductBasicInfo";
import ProductPricingPanel from "../_components/ProductPricingPanel";
import ClothingAttributesPanel from "../_components/ClothingAttributesPanel";
import GadgetAttributesPanel from "../_components/GadgetAttributesPanel";
import ProductSpecifications from "../_components/ProductSpecifications";
import ProductMediaPanel from "../_components/ProductMediaPanel";
import ProductSidebarPanel from "../_components/ProductSidebarPanel";

const ProductFormInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const isEditing = !!productId;

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: productToEdit } = useGetProductByIdQuery(productId, {
    skip: !isEditing,
  });
  const { data: categoriesData } = useGetCategoriesQuery({});
  const { data: unitsData } = useGetUnitsQuery({});
  const { data: allProductsData } = useGetProductsQuery({ limit: 100 });
  const { data: brandsData } = useGetBrandsQuery({});

  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    productType: "clothing", // 'clothing' | 'gadget' | 'general'
    variantType: "single", // 'single' | 'variant'
    costPrice: "",
    regularPrice: "",
    salePrice: "",
    stock: "",
    sku: "",
    lowStockAlert: 5,
    weightOrVolume: "",
    categoryID: "",
    unit: "",
    brandID: "nonebrand",
    status: "active",
    isFeatured: false,
    isNewCollection: false,
    isTrending: false,
    isOnSale: false,
    lowdown: [],
    specifications: [],
    variants: [],
    clothingAttributes: {
      sizes: ["M", "L", "XL"],
      colors: [{ name: "Black", hexCode: "#000000" }],
      sizeGuideUrl: "",
      material: "100% Cotton",
      fit: "Regular Fit",
    },
    gadgetAttributes: {
      modelNumber: "",
      releaseYear: new Date().getFullYear(),
    },
    warranty: {
      duration: "1 Year",
      type: "official",
      details: "Official brand warranty coverage",
    },
    freeShipping: false,
    shippingCost: "",
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    metaTitle: "",
    metaDescription: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing && productToEdit?.data) {
      const prod = productToEdit.data;
      setFormData((prev: any) => ({
        ...prev,
        ...prod,
        productType: prod.productType || "clothing",
        variantType: prod.variantType || (prod.variants?.length > 0 ? "variant" : "single"),
        categoryID: prod.categoryID?._id || prod.categoryID,
        unit: prod.unit?._id || prod.unit,
        brandID: prod.brandID?._id || prod.brandID || "nonebrand",
        dimensions: prod.dimensions || { length: "", width: "", height: "" },
        specifications: prod.specifications || [],
        variants: prod.variants || [],
        clothingAttributes: prod.clothingAttributes || prev.clothingAttributes,
        gadgetAttributes: prod.gadgetAttributes || prev.gadgetAttributes,
        warranty: prod.warranty || prev.warranty,
        lowdown: prod.lowdown || [],
        isTrending: !!prod.isTrending,
        isNewCollection: !!prod.isNewCollection,
        isFeatured: !!prod.isFeatured,
      }));
      if (prod.thumbnail) setThumbnailPreview(prod.thumbnail);
      if (prod.images) setGalleryPreviews(prod.images);
    }
  }, [isEditing, productToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]:
            type === "checkbox"
              ? checked
              : type === "number"
                ? value === ""
                  ? ""
                  : Number(value)
                : value,
        },
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
              ? value === ""
                ? ""
                : Number(value)
              : value,
      }));
    }

    if (name === "name" && !isEditing) {
      setFormData((prev: any) => ({
        ...prev,
        slug: cleanSlug(value),
      }));
    } else if (name === "slug") {
      setFormData((prev: any) => ({
        ...prev,
        slug: cleanSlug(value),
      }));
    }
  };

  // ===== VARIANTS =====
  const addVariant = (customVariant?: any) => {
    setFormData((prev: any) => ({
      ...prev,
      variants: [
        ...prev.variants,
        customVariant || {
          sku: `${prev.sku || "SKU"}-${prev.variants.length + 1}`.toUpperCase(),
          costPrice: prev.costPrice || "",
          regularPrice: prev.regularPrice || "",
          salePrice: prev.salePrice || "",
          stock: 10,
          attributes: {},
        },
      ],
    }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]:
        value === ""
          ? ""
          : ["costPrice", "regularPrice", "salePrice", "stock"].includes(field)
            ? Number(value)
            : value,
    };
    setFormData((prev: any) => ({ ...prev, variants: updatedVariants }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      variants: formData.variants.filter((_: any, i: number) => i !== index),
    }));
  };

  // ===== SPECIFICATIONS =====
  const addSpecification = (defaultKey?: string) => {
    setFormData((prev: any) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { key: defaultKey || "", value: "" },
      ],
    }));
  };

  const handleSpecChange = (index: number, field: string, value: string) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, specifications: updatedSpecs }));
  };

  const removeSpecification = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      specifications: prev.specifications.filter(
        (_: any, i: number) => i !== index,
      ),
    }));
  };

  // ===== MEDIA =====
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files]);
      setGalleryPreviews((prev) => [
        ...prev,
        ...files.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const hasVariants =
      formData.variantType === "variant" || formData.variants?.length > 0;

    if (!formData.name) return toast.error("Please enter a product title");
    if (!formData.categoryID) return toast.error("Please select a category");

    const cleanedData = {
      ...formData,
      slug: cleanSlug(formData.slug || formData.name),
      costPrice: formData.costPrice === "" ? 0 : Number(formData.costPrice),
      regularPrice: formData.regularPrice === "" ? 0 : Number(formData.regularPrice),
      salePrice: formData.salePrice === "" ? 0 : Number(formData.salePrice),
      stock: formData.stock === "" ? 0 : Number(formData.stock),
      weightOrVolume:
        formData.weightOrVolume === "" ? undefined : formData.weightOrVolume,
      variants: formData.variants.map((v: any) => ({
        ...v,
        costPrice: v.costPrice === "" ? 0 : Number(v.costPrice),
        regularPrice: v.regularPrice === "" ? 0 : Number(v.regularPrice),
        salePrice: v.salePrice === "" ? 0 : Number(v.salePrice),
        stock: v.stock === "" ? 0 : Number(v.stock),
      })),
    };

    try {
      const submissionData = new FormData();
      Object.keys(cleanedData).forEach((key) => {
        if (
          [
            "specifications",
            "variants",
            "clothingAttributes",
            "gadgetAttributes",
            "warranty",
            "lowdown",
            "dimensions",
          ].includes(key)
        ) {
          submissionData.append(key, JSON.stringify(cleanedData[key]));
        } else if (
          cleanedData[key] !== undefined &&
          cleanedData[key] !== null
        ) {
          submissionData.append(key, cleanedData[key]);
        }
      });

      if (thumbnailFile) submissionData.append("thumbnail", thumbnailFile);
      galleryFiles.forEach((file) => submissionData.append("images", file));

      if (isEditing) {
        await updateProduct({ id: productId, data: submissionData }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(submissionData).unwrap();
        toast.success("Product created successfully");
      }
      router.push("/dashboard/admin/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save product");
    }
  };

  const categories = categoriesData?.data || [];
  const units = unitsData?.data || [];
  const brands = brandsData?.data || [];
  const hasVariants =
    formData.variantType === "variant" || (formData.variants && formData.variants.length > 0);

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-8 pb-32">
      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <ProductFormHeader
        isEditing={isEditing}
        status={formData.status}
        isCreating={isCreating}
        isUpdating={isUpdating}
        onSubmit={handleSubmit}
      />

      {/* Product Type & Variant Mode Toggles */}
      <ProductTypeToggle
        productType={formData.productType}
        onChange={(type) =>
          setFormData((p: any) => ({ ...p, productType: type }))
        }
        variantType={formData.variantType}
        onVariantTypeChange={(vType) =>
          setFormData((p: any) => ({ ...p, variantType: vType }))
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <ProductBasicInfo
            formData={formData}
            categories={categories}
            brands={brands}
            isEditing={isEditing}
            productType={formData.productType}
            onChange={handleChange}
            onLowdownChange={(val) =>
              setFormData((p: any) => ({ ...p, lowdown: val }))
            }
            onTagsChange={(tags) => setFormData((p: any) => ({ ...p, tags }))}
          />

          {/* Clothing Specifics */}
          {formData.productType === "clothing" && (
            <ClothingAttributesPanel
              clothingAttributes={formData.clothingAttributes}
              onChange={(updated) =>
                setFormData((p: any) => ({ ...p, clothingAttributes: updated }))
              }
            />
          )}

          {/* Gadget Specifics */}
          {formData.productType === "gadget" && (
            <GadgetAttributesPanel
              gadgetAttributes={formData.gadgetAttributes}
              warranty={formData.warranty}
              onGadgetAttributesChange={(updated) =>
                setFormData((p: any) => ({ ...p, gadgetAttributes: updated }))
              }
              onWarrantyChange={(updated) =>
                setFormData((p: any) => ({ ...p, warranty: updated }))
              }
            />
          )}

          {/* Pricing & Inventory Panel */}
          <ProductPricingPanel
            formData={formData}
            units={units}
            hasVariants={hasVariants}
            productType={formData.productType}
            onChange={handleChange}
            onVariantChange={handleVariantChange}
            onAddVariant={addVariant}
            onRemoveVariant={removeVariant}
          />

          {/* Technical Specifications */}
          <ProductSpecifications
            specifications={formData.specifications}
            onAdd={addSpecification}
            onChange={handleSpecChange}
            onRemove={removeSpecification}
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <ProductMediaPanel
            thumbnailPreview={thumbnailPreview}
            galleryPreviews={galleryPreviews}
            onThumbnailSelect={handleThumbnailSelect}
            onThumbnailRemove={() => {
              setThumbnailFile(null);
              setThumbnailPreview("");
            }}
            onGallerySelect={handleGallerySelect}
            onGalleryRemove={removeGalleryImage}
          />

          <ProductSidebarPanel formData={formData} onChange={handleChange} />
        </div>
      </div>
    </form>
  );
};

const ProductForm = () => (
  <Suspense
    fallback={
      <div className="p-20 text-center text-blue-600 font-bold text-sm tracking-widest">
        LOADING ENGINE...
      </div>
    }
  >
    <ProductFormInner />
  </Suspense>
);

export default ProductForm;

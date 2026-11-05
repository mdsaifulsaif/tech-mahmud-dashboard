"use client";

import { FiImage, FiX } from "react-icons/fi";

interface Props {
  thumbnailPreview: string;
  galleryPreviews: string[];
  onThumbnailSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onThumbnailRemove: () => void;
  onGallerySelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryRemove: (index: number) => void;
}

const ProductMediaPanel = ({
  thumbnailPreview,
  galleryPreviews,
  onThumbnailSelect,
  onThumbnailRemove,
  onGallerySelect,
  onGalleryRemove,
}: Props) => {
  return (
    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
      <h3 className="font-bold text-gray-800 flex items-center gap-2">
        <FiImage /> Media Assets
      </h3>

      {/* Thumbnail */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 block">Thumbnail Image *</label>
        <div className="border-2 border-dashed border-gray-200 rounded-md p-5 text-center bg-gray-50 relative hover:bg-gray-100 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={onThumbnailSelect}
          />
          <FiImage size={24} className="mx-auto text-gray-300 mb-1" />
          <span className="text-xs text-gray-400">Click to upload main image</span>
        </div>
        {thumbnailPreview && (
          <div className="relative border border-gray-200 rounded-md overflow-hidden bg-gray-50 w-full h-56">
            <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onThumbnailRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full"
            >
              <FiX size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-400 block">Gallery Images</label>
        <div className="border-2 border-dashed border-gray-200 rounded-md p-5 text-center bg-gray-50 relative hover:bg-gray-100 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={onGallerySelect}
          />
          <FiImage size={24} className="mx-auto text-gray-300 mb-1" />
          <span className="text-xs text-gray-400">Click to upload extra images</span>
        </div>
        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {galleryPreviews.map((src, i) => (
              <div key={i} className="relative group border border-gray-200 rounded-md overflow-hidden aspect-square bg-gray-50">
                <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onGalleryRemove(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMediaPanel;
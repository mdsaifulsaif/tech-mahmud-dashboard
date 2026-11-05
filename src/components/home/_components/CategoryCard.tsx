import Link from "next/link";

const CategoryCard = ({ category }: { category: any }) => {
  return (
    <Link href={`/shop?category=${category._id}`} className="block">
      <div className="group bg-white border border-gray-100 rounded-md p-4 flex flex-col items-center justify-between text-center min-h-[180px] hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-300">
        <div className="w-full h-24 flex items-center justify-center mb-4">
          <img
            src={category.image}
            alt={category.name}
            className="max-h-full object-contain group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
        <h3 className="text-xs sm:text-[14px] font-bold group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
          {category.name}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
import { Eye, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router";
import type { IProduct } from "../../reducer/productSlice";

interface Props {
  product: IProduct;
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();

  const discountPercent =
    product.hasDiscount && product.price > 0 && product.discountPrice > 0
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  // Derive rating review count from product id/quantity for realistic display
  const reviewCount = product.quantity
    ? product.quantity * 3 + 12
    : (product.id * 13) % 90 + 10;
  const isNew = !product.hasDiscount && product.id % 3 === 0;

  const handleProductClick = () => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleProductClick}
      className="flex flex-col w-full group select-none cursor-pointer"
    >
      {/* Image Container with Badges and Actions */}
      <div className="relative bg-[#F5F5F5] rounded-sm flex items-center justify-center h-64 overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent ? (
            <span className="bg-[#DB4444] text-white text-xs font-semibold px-2.5 py-1 rounded">
              -{discountPercent}%
            </span>
          ) : isNew ? (
            <span className="bg-[#00FF66] text-black text-xs font-semibold px-2.5 py-1 rounded">
              NEW
            </span>
          ) : null}
        </div>

        {/* Quick Action Buttons */}
        <div
          className="absolute top-3 right-3 flex flex-col gap-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-red-50 hover:text-[#DB4444] text-gray-700 transition"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-100 text-gray-700 transition"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image - Full size without shrink or hover zoom */}
        <img
          className="w-full h-full object-cover"
          src={`https://store-api.softclub.tj/images/${product.image || product.images?.[0]?.images || ""}`}
          alt={product.productName}
          onError={(e) => {
            (e.target as HTMLElement).style.opacity = "0.5";
          }}
        />

        {/* Slide-up "Add To Cart" button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Added ${product.productName} to cart!`);
          }}
          className="absolute bottom-0 left-0 right-0 bg-black text-white text-center py-2.5 font-medium text-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer hover:bg-gray-900"
        >
          Add To Cart
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1.5 pt-3">
        <p
          className="text-base font-semibold text-gray-900 truncate hover:text-[#DB4444] transition"
          title={product.productName}
        >
          {product.productName}
        </p>

        {/* Price Row */}
        <div className="flex items-center gap-3">
          <span className="text-[#DB4444] text-base font-semibold">
            ${product.hasDiscount ? product.discountPrice : product.price}
          </span>
          {product.hasDiscount && (
            <span className="text-[#7F7F7F] text-sm line-through font-medium">
              ${product.price}
            </span>
          )}
        </div>

        {/* Rating and Color Variants */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-[#FFAD33]">
            <Star className="w-4 h-4 fill-[#FFAD33]" />
            <Star className="w-4 h-4 fill-[#FFAD33]" />
            <Star className="w-4 h-4 fill-[#FFAD33]" />
            <Star className="w-4 h-4 fill-[#FFAD33]" />
            <Star className="w-4 h-4 fill-[#FFAD33]" />
          </div>
          <span className="text-xs text-gray-500 font-semibold">
            ({reviewCount})
          </span>
        </div>

        {/* Color indicator if product has color */}
        {product.color && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span
              className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-black shadow-xs"
              style={{ backgroundColor: product.color }}
              title={product.color}
            />
            <span
              className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-gray-300 shadow-xs bg-[#DB4444]"
              title="Red variant"
            />
          </div>
        )}
      </div>
    </div>
  );
}

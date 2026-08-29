import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Heart, Eye, Star, ShoppingCart, Check } from "lucide-react";
import type { IProduct } from "../../reducer/productSlice";
import { addProductToCart } from "../../reducer/cartSlice";
import type { AppDispatch } from "../../store/store";

interface ProductCardProps {
  product: IProduct;
  isNew?: boolean;
}

export default function ProductCard({ product, isNew }: ProductCardProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent =
    product.hasDiscount && product.discountPrice && product.price
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : null;

  const reviewCount = product.quantity
    ? product.quantity * 3 + 12
    : (product.id * 17) % 80 + 15;

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    await dispatch(addProductToCart(product.id));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      onClick={handleProductClick}
      className="flex flex-col w-full group select-none cursor-pointer"
    >
      <div className="relative bg-[#F5F5F5] rounded-xl flex items-center justify-center h-60 sm:h-72 overflow-hidden">
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent ? (
            <span className="bg-[#DB4444] text-white text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md shadow-xs">
              -{discountPercent}%
            </span>
          ) : isNew ? (
            <span className="bg-[#00FF66] text-black text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md shadow-xs">
              NEW
            </span>
          ) : null}
        </div>

        <div
          className="absolute top-3 right-3 flex flex-col gap-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer hover:bg-red-50 hover:text-[#DB4444] text-gray-700 transition"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 text-gray-700 transition"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        <img
          className="w-full h-full object-contain p-4"
          src={`https://store-api.softclub.tj/images/${product.image || product.images?.[0]?.images || ""}`}
          alt={product.productName}
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.triedFallback) {
              target.dataset.triedFallback = "true";
              if (target.src.includes("/images/") && !target.src.includes("/swagger/images/")) {
                target.src = target.src.replace("/images/", "/swagger/images/");
              } else if (target.src.includes("/swagger/images/")) {
                target.src = target.src.replace("/swagger/images/", "/images/");
              }
            } else {
              target.style.opacity = "0.5";
            }
          }}
        />

        {/* Add to Cart button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`absolute bottom-0 left-0 right-0 py-3 font-semibold text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
            isAdded
              ? "bg-emerald-600 text-white translate-y-0"
              : "bg-black text-white lg:translate-y-full lg:group-hover:translate-y-0 hover:bg-gray-900"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Добавлено!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 lg:hidden" />
              <span>{t('home.addToCart')}</span>
            </>
          )}
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1.5 pt-3">
        <p
          className="text-base sm:text-lg font-bold text-gray-900 truncate hover:text-[#DB4444] transition"
          title={product.productName}
        >
          {product.productName}
        </p>

        {/* Price Row */}
        <div className="flex items-center gap-3">
          <span className="text-[#DB4444] text-base sm:text-lg font-extrabold">
            ${product.hasDiscount ? product.discountPrice : product.price}
          </span>
          {product.hasDiscount && (
            <span className="text-[#7F7F7F] text-sm sm:text-base line-through font-medium">
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
          <span className="text-xs sm:text-sm font-semibold text-gray-500">
            ({reviewCount})
          </span>
        </div>
      </div>
    </div>
  );
}

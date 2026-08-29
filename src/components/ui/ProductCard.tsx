import { Eye, Heart, Star, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IProduct } from "../../reducer/productSlice";
import { addProductToCart } from "../../reducer/cartSlice";
import type { AppDispatch } from "../../store/store";

interface Props {
  product: IProduct;
}

export default function ProductCard({ product }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent =
    product.hasDiscount && product.price > 0 && product.discountPrice > 0
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  const reviewCount = product.quantity || 0;
  const isNew = !product.hasDiscount && product.id % 3 === 0;

  const handleProductClick = () => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
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
      <div className="relative bg-[#F5F5F5] rounded-sm flex items-center justify-center h-64 overflow-hidden">
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

        <img
          className="w-full h-full object-cover"
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

        <button
          type="button"
          onClick={handleAddToCart}
          className={`absolute bottom-0 left-0 right-0 py-2.5 font-medium text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
            isAdded
              ? "bg-emerald-600 text-white translate-y-0"
              : "bg-black text-white translate-y-full group-hover:translate-y-0 hover:bg-gray-900"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Добавлено!</span>
            </>
          ) : (
            <span>{t('home.addToCart')}</span>
          )}
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
          <span className="text-xs font-semibold text-gray-500">
            ({reviewCount})
          </span>
        </div>
      </div>
    </div>
  );
}

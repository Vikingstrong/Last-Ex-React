import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import {
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Star,
  Truck,
} from "lucide-react";

import { type AppDispatch, type RootState } from "../store/store";
import { getProductById, getProducts, type IProduct } from "../reducer/productSlice";
import ProductCard from "../components/ui/ProductCard";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const productsStore = useSelector((store: RootState) => store.products);

  const [localProduct] = useState<IProduct | null>(() => {
    const saved = localStorage.getItem("selectedProduct");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("default");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (id) {
      dispatch(getProductById(id));
    }

    if (!productsStore.dataProduct || productsStore.dataProduct.length === 0) {
      dispatch(getProducts({ pageNumber: 1, pageSize: 12 }));
    }
  }, [id, dispatch]);

  
  const activeProduct = productsStore.productById || localProduct;

  
  const imagesList: string[] = activeProduct?.images && activeProduct.images.length > 0
    ? activeProduct.images.map((img) => img.images)
    : activeProduct?.image
    ? [activeProduct.image]
    : [];

    
  const displayThumbnails = imagesList.length > 0
    ? Array.from({ length: 4 }).map((_, i) => imagesList[i % imagesList.length])
    : [];

  const mainImage = selectedImage || imagesList[0] || "";

  useEffect(() => {
    if (productsStore.productById) {
      const firstImg = productsStore.productById.images?.[0]?.images || productsStore.productById.image || "";
      setSelectedImage(firstImg);
      localStorage.setItem("selectedProduct", JSON.stringify(productsStore.productById));
    } else if (localProduct) {
      const firstImg = localProduct.images?.[0]?.images || localProduct.image || "";
      setSelectedImage(firstImg);
    }
  }, [productsStore.productById, localProduct]);

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <main className="max-w-300 m-auto px-5 lg:px-0 py-8 flex flex-col gap-16 min-h-screen">
      
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <NavLink to="/profile" className="hover:text-black transition">
          Account
        </NavLink>
        <span>/</span>
        <NavLink to="/catalog" className="hover:text-black transition">
          {activeProduct?.brand || activeProduct?.categoryName || "Products"}
        </NavLink>
        <span>/</span>
        <span className="font-semibold text-black truncate max-w-xs">
          {activeProduct?.productName || "Product"}
        </span>
      </div>


      {productsStore.loadings.loadingProductById ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
          <div className="lg:col-span-2 flex lg:flex-col gap-4 order-2 lg:order-1">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={112}
                height={112}
                animation="wave"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </div>

          <div className="lg:col-span-5 h-[450px] lg:h-[500px] order-1 lg:order-2">
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{ borderRadius: 1 }}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 order-3">
            <Skeleton variant="text" width="80%" height={40} animation="wave" />
            <Skeleton variant="text" width="45%" height={24} animation="wave" />
            <Skeleton variant="text" width="30%" height={36} animation="wave" />
            <Skeleton variant="rectangular" width="100%" height={80} animation="wave" sx={{ borderRadius: 1 }} />
            <Skeleton variant="text" width="50%" height={30} animation="wave" />
            <Skeleton variant="rectangular" width="100%" height={50} animation="wave" sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={120} animation="wave" sx={{ borderRadius: 1 }} />
          </div>
        </div>
      ) : activeProduct ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          <div className="lg:col-span-2 flex lg:flex-col gap-4 order-2 lg:order-1 overflow-x-auto lg:overflow-visible">
            {displayThumbnails.map((thumbImg, thumbIdx) => (
              <div
                key={thumbIdx}
                onClick={() => setSelectedImage(thumbImg)}
                className={`bg-[#F5F5F5] rounded p-3 h-28 w-28 shrink-0 flex items-center justify-center cursor-pointer transition-all`}
              >
                <img
                  src={`https://store-api.softclub.tj/images/${thumbImg}`}
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = "0.5";
                  }}
                />
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 bg-[#F5F5F5] rounded flex items-center justify-center p-8 h-[450px] lg:h-[500px] order-1 lg:order-2">
            <img
              src={`https://store-api.softclub.tj/images/${mainImage}`}
              alt={activeProduct.productName}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.opacity = "0.5";
              }}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 order-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {activeProduct.productName}
            </h1>


            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center text-[#FFAD33]">
                <Star className="w-4 h-4 fill-[#FFAD33]" />
                <Star className="w-4 h-4 fill-[#FFAD33]" />
                <Star className="w-4 h-4 fill-[#FFAD33]" />
                <Star className="w-4 h-4 fill-[#FFAD33]" />
                <Star className="w-4 h-4 fill-[#FFAD33]" />
              </div>
              <span className="text-gray-500 font-medium">
                ({activeProduct.quantity ? activeProduct.quantity * 3 + 12 : (activeProduct.id * 13) % 90 + 10} Reviews)
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-[#00FF66] font-medium">In Stock</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold text-gray-900">
                ${activeProduct.hasDiscount ? activeProduct.discountPrice : activeProduct.price}.00
              </span>
              {activeProduct.hasDiscount && (
                <span className="text-gray-400 text-lg line-through">
                  ${activeProduct.price}.00
                </span>
              )}
            </div>


            <p className="text-sm text-gray-700 leading-relaxed border-b border-gray-200 pb-4">
              {activeProduct.description || "PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive."}
            </p>


            <div className="flex items-center gap-4 pt-1">
              <span className="text-sm font-medium text-gray-900">Colours:</span>
              <div className="flex items-center gap-2">
                <span
                  onClick={() => setSelectedColor("color1")}
                  className={`w-5 h-5 rounded-full bg-[#A0BCE0] cursor-pointer transition ring-2 ${
                    selectedColor === "color1" ? "ring-black" : "ring-transparent"
                  }`}
                />
                <span
                  onClick={() => setSelectedColor("color2")}
                  className={`w-5 h-5 rounded-full bg-[#E07575] cursor-pointer transition ring-2 ${
                    selectedColor === "color2" ? "ring-black" : "ring-transparent"
                  }`}
                />
              </div>
            </div>


            <div className="flex items-center gap-4 pt-1">
              <span className="text-sm font-medium text-gray-900">Size:</span>
              <div className="flex items-center gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-8 h-8 rounded text-sm font-medium transition cursor-pointer border ${
                      selectedSize === size
                        ? "bg-[#DB4444] text-white border-[#DB4444]"
                        : "bg-white text-gray-800 border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>


            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  type="button"
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-2 text-base font-bold text-gray-900 border-x border-gray-300 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 bg-[#DB4444] text-white hover:bg-[#c0392b] transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>


              <button
                type="button"
                className="flex-1 bg-[#DB4444] text-white py-2.5 px-6 rounded font-semibold text-sm hover:bg-[#c0392b] transition cursor-pointer"
              >
                Buy Now
              </button>


              <button
                type="button"
                className="p-2.5 border border-gray-300 rounded hover:text-[#DB4444] hover:border-[#DB4444] text-gray-700 transition cursor-pointer"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>


            <div className="border border-gray-300 rounded-sm p-4 flex flex-col gap-4 mt-4 select-none">
              <div className="flex items-start gap-4">
                <Truck className="w-7 h-7 text-gray-900 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Free Delivery
                  </h4>
                  <p className="text-xs text-gray-600 underline cursor-pointer mt-0.5">
                    Enter your postal code for Delivery Availability
                  </p>
                </div>
              </div>

              <div className="border-b border-gray-200" />

              {/* Row 2: Return Delivery */}
              <div className="flex items-start gap-4">
                <RefreshCw className="w-7 h-7 text-gray-900 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Return Delivery
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Free 30 Days Delivery Returns.{" "}
                    <span className="underline cursor-pointer">Details</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 3. Related Items Section with Swiper */}
      <section className="flex flex-col gap-8 pt-8">
        {/* Title Header with Red Tag */}
        <div className="flex items-center gap-3">
          <div className="w-4 h-9 bg-[#DB4444] rounded-xs" />
          <h3 className="text-xl font-bold text-[#DB4444]">Related Item</h3>
        </div>

        {/* Swiper Carousel of Related Products */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="w-full"
        >
          {productsStore.dataProduct?.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </main>
  );
}

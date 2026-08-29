import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { Skeleton } from "@mui/material";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { type AppDispatch, type RootState } from "../store/store";
import { getProducts, type IProduct } from "../reducer/productSlice";
import { getCategories, type ICategory } from "../reducer/catalogSlice";
import ProductCard from "../components/ui/ProductCard";
import ProductSkeleton from "../components/ui/ProductSkeleton";
import PrimaryButton from "../components/ui/PrimaryButton";

// Static UI filters that are not returned by the backend API
const FEATURES_LIST = [
  "Metallic",
  "Plastic cover",
  "8GB Ram",
  "Super power",
  "Large Memory",
  "Bluetooth 5.0",
  "Wireless",
  "Fast Charging",
];

const CONDITION_LIST = ["Any", "Refurbished", "Brand new", "Old items"];

export default function Catalog() {
  const dispatch = useDispatch<AppDispatch>();
  const productsStore = useSelector((store: RootState) => store.products);
  const catalogStore = useSelector((store: RootState) => store.catalog);

  // Filter accordion toggle states
  const [openSections, setOpenSections] = useState({
    category: true,
    brands: true,
    features: true,
    price: true,
    condition: true,
    ratings: true,
  });

  // State for "See all" (5 items limit by default)
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Mobile filters drawer open state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("Any");
  const [sortOption, setSortOption] = useState<string>("popularity");

  useEffect(() => {
    dispatch(getProducts({ pageNumber: 1, pageSize: 12 }));
    dispatch(getCategories());
  }, [dispatch]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSeeAllCategories = () => {
    const nextState = !showAllCategories;
    setShowAllCategories(nextState);
    // Trigger re-fetch as requested
    dispatch(getCategories());
  };

  const handleSeeAllBrands = () => {
    const nextState = !showAllBrands;
    setShowAllBrands(nextState);
    // Trigger re-fetch with higher page size if expanding
    dispatch(getProducts({ pageNumber: 1, pageSize: nextState ? 50 : 12 }));
  };

  const handleMoreProducts = () => {
    const currentCount = productsStore.dataProduct?.length || 12;
    dispatch(getProducts({ pageNumber: 1, pageSize: currentCount + 12 }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Limit categories to 5 unless "See all" is active
  const visibleCategories = showAllCategories
    ? catalogStore.categories
    : catalogStore.categories?.slice(0, 5);

  // Limit brands to 5 unless "See all" is active
  const visibleBrands = showAllBrands
    ? productsStore.dataBrands
    : productsStore.dataBrands?.slice(0, 5);

  // Limit features to 5 unless "See all" is active
  const visibleFeatures = showAllFeatures
    ? FEATURES_LIST
    : FEATURES_LIST.slice(0, 5);

  return (
    <main className="max-w-300 m-auto px-5 lg:px-0 py-8 min-h-screen">
      {/* Top Header: Breadcrumbs & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <NavLink to="/" className="hover:text-black transition">
            Home
          </NavLink>
          <span>/</span>
          <span className="font-semibold text-black">Explore Our Products</span>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort By Select */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none border border-gray-300 rounded px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 bg-white outline-none cursor-pointer hover:border-gray-400 focus:border-black transition"
            >
              <option value="popularity">Popularity</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="flex gap-10 items-start">
        {/* Left Sidebar Filters (Desktop & Mobile Drawer) */}
        <aside
          className={`
            ${
              mobileFilterOpen
                ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
                : "hidden"
            }
            lg:block lg:static lg:w-64 lg:p-0 lg:overflow-visible shrink-0
          `}
        >
          {/* Mobile Close Bar */}
          {mobileFilterOpen && (
            <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
              <h3 className="text-lg font-bold">Filters</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="text-gray-500 hover:text-black font-semibold text-sm px-2 py-1"
              >
                Close
              </button>
            </div>
          )}

          <div className="flex flex-col gap-6 select-none">
            {/* 1. Category Filter (Real backend data from catalogSlice) */}
            <div className="flex flex-col border-b border-gray-200 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("category")}
                className="flex items-center justify-between w-full py-1 text-base font-semibold text-gray-900 cursor-pointer"
              >
                <span>Category</span>
                {openSections.category ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {openSections.category && (
                <div className="flex flex-col gap-2.5 mt-3 text-sm">
                  <span
                    onClick={() => setSelectedCategory("all")}
                    className={`cursor-pointer transition ${
                      selectedCategory === "all"
                        ? "text-[#DB4444] font-medium"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    All products
                  </span>

                  {/* Skeletons when loading categories */}
                  {catalogStore.loaders.categoryLoading ? (
                    <div className="flex flex-col gap-2 mt-1">
                      <Skeleton variant="text" width="80%" height={20} animation="wave" />
                      <Skeleton variant="text" width="70%" height={20} animation="wave" />
                      <Skeleton variant="text" width="75%" height={20} animation="wave" />
                      <Skeleton variant="text" width="65%" height={20} animation="wave" />
                    </div>
                  ) : (
                    visibleCategories?.map((category: ICategory) => (
                      <span
                        key={category.id}
                        onClick={() => setSelectedCategory(category.categoryName)}
                        className={`cursor-pointer transition truncate ${
                          selectedCategory === category.categoryName
                            ? "text-[#DB4444] font-medium"
                            : "text-gray-600 hover:text-black"
                        }`}
                      >
                        {category.categoryName}
                      </span>
                    ))
                  )}

                  {catalogStore.categories && catalogStore.categories.length > 5 && (
                    <span
                      onClick={handleSeeAllCategories}
                      className="text-[#DB4444] text-xs font-semibold cursor-pointer hover:underline mt-1"
                    >
                      {showAllCategories ? "Show less" : "See all"}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 2. Brands Filter (Real backend data from productSlice) */}
            <div className="flex flex-col border-b border-gray-200 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("brands")}
                className="flex items-center justify-between w-full py-1 text-base font-semibold text-gray-900 cursor-pointer"
              >
                <span>Brands</span>
                {openSections.brands ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {openSections.brands && (
                <div className="flex flex-col gap-2.5 mt-3 text-sm">
                  {/* Skeletons when loading brands */}
                  {productsStore.loadings.loadingProducts && (!productsStore.dataBrands || productsStore.dataBrands.length === 0) ? (
                    <div className="flex flex-col gap-2 mt-1">
                      <Skeleton variant="text" width="80%" height={20} animation="wave" />
                      <Skeleton variant="text" width="70%" height={20} animation="wave" />
                      <Skeleton variant="text" width="60%" height={20} animation="wave" />
                      <Skeleton variant="text" width="75%" height={20} animation="wave" />
                    </div>
                  ) : (
                    visibleBrands?.map((brand) => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-black"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-[#DB4444] focus:ring-[#DB4444] accent-[#DB4444] cursor-pointer"
                        />
                        <span className="truncate">{brand.brandName}</span>
                      </label>
                    ))
                  )}

                  {productsStore.dataBrands && productsStore.dataBrands.length > 5 && (
                    <span
                      onClick={handleSeeAllBrands}
                      className="text-[#DB4444] text-xs font-semibold cursor-pointer hover:underline mt-1"
                    >
                      {showAllBrands ? "Show less" : "See all"}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 3. Features Filter */}
            <div className="flex flex-col border-b border-gray-200 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("features")}
                className="flex items-center justify-between w-full py-1 text-base font-semibold text-gray-900 cursor-pointer"
              >
                <span>Features</span>
                {openSections.features ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {openSections.features && (
                <div className="flex flex-col gap-2.5 mt-3 text-sm">
                  {visibleFeatures.map((feature, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-black"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-[#DB4444] focus:ring-[#DB4444] accent-[#DB4444] cursor-pointer"
                      />
                      <span>{feature}</span>
                    </label>
                  ))}

                  {FEATURES_LIST.length > 5 && (
                    <span
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                      className="text-[#DB4444] text-xs font-semibold cursor-pointer hover:underline mt-1"
                    >
                      {showAllFeatures ? "Show less" : "See all"}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 4. Price range Filter (Synced with backend minMaxPrice) */}
            <div className="flex flex-col border-b border-gray-200 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("price")}
                className="flex items-center justify-between w-full py-1 text-base font-semibold text-gray-900 cursor-pointer"
              >
                <span>Price range</span>
                {openSections.price ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {openSections.price && (
                <div className="flex flex-col gap-4 mt-3">
                  {/* Slider Visual Track */}
                  <div className="relative w-full py-2">
                    <div className="w-full h-1 bg-gray-200 rounded-full" />
                    <div className="absolute top-1/2 left-1/5 right-1/4 h-1 bg-[#DB4444] -translate-y-1/2" />
                    <div className="absolute top-1/2 left-1/5 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#DB4444] shadow cursor-pointer" />
                    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#DB4444] shadow cursor-pointer" />
                  </div>

                  {/* Min / Max Inputs */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border border-gray-300 rounded px-2.5 py-1 flex flex-col bg-white">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">
                        Min
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        defaultValue={productsStore.minMaxPrice?.minPrice || 0}
                        className="w-full text-sm outline-none text-gray-800 bg-transparent font-medium"
                      />
                    </div>
                    <div className="flex-1 border border-gray-300 rounded px-2.5 py-1 flex flex-col bg-white">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">
                        Max
                      </span>
                      <input
                        type="number"
                        placeholder="99999"
                        defaultValue={
                          productsStore.minMaxPrice?.maxPrice || 99999
                        }
                        className="w-full text-sm outline-none text-gray-800 bg-transparent font-medium"
                      />
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    type="button"
                    className="w-full py-2 border border-[#DB4444] text-[#DB4444] rounded text-sm font-semibold hover:bg-[#DB4444] hover:text-white transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* 5. Condition Filter */}
            <div className="flex flex-col border-b border-gray-200 pb-5">
              <button
                type="button"
                onClick={() => toggleSection("condition")}
                className="flex items-center justify-between w-full py-1 text-base font-semibold text-gray-900 cursor-pointer"
              >
                <span>Condition</span>
                {openSections.condition ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {openSections.condition && (
                <div className="flex flex-col gap-2.5 mt-3 text-sm">
                  {CONDITION_LIST.map((condition, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-black"
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={condition}
                        checked={selectedCondition === condition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="w-4 h-4 text-[#DB4444] focus:ring-[#DB4444] accent-[#DB4444] cursor-pointer"
                      />
                      <span>{condition}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Ratings Filter */}
            <div className="flex flex-col pb-5">
              <button
                type="button"
                onClick={() => toggleSection("ratings")}
                className="flex items-center justify-between w-full py-1 text-base font-semibold text-gray-900 cursor-pointer"
              >
                <span>Ratings</span>
                {openSections.ratings ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {openSections.ratings && (
                <div className="flex flex-col gap-2.5 mt-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <label
                      key={stars}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-[#DB4444] focus:ring-[#DB4444] accent-[#DB4444] cursor-pointer"
                      />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-4 h-4 ${
                              starIdx < stars
                                ? "fill-[#FFAD33] text-[#FFAD33]"
                                : "text-gray-300 fill-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Section: Product Grid */}
        <section className="flex-1 w-full">
          {productsStore.loadings.loadingProducts && (!productsStore.dataProduct || productsStore.dataProduct.length === 0) ? (
            <ProductSkeleton count={9} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsStore.dataProduct?.map((product: IProduct) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* More Products Button */}
          <div className="flex justify-center mt-14 mb-8">
            <PrimaryButton text="More Products" onClick={handleMoreProducts} />
          </div>
        </section>
      </div>

      {/* Floating Scroll-to-Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-20 lg:bottom-8 right-6 lg:right-8 z-30 w-11 h-11 rounded-full bg-[#F5F5F5] hover:bg-gray-200 border border-gray-200 flex items-center justify-center shadow-md transition cursor-pointer"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-gray-800" />
      </button>
    </main>
  );
}

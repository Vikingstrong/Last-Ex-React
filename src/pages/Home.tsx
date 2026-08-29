import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/navigation'

import { NavLink } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'
import IphoneModel from "../components/3DModels/IphoneModel"
import PrimaryButton from "../components/ui/PrimaryButton"
import { type AppDispatch, type RootState } from "../store/store"
import { getProducts, type IProduct } from "../reducer/productSlice"
import ProductCard from "../components/ui/ProductCard"
import { useEffect } from "react"
import MacBookModel from '../components/3DModels/MacBookModel'
import { getCategories, type ICategory } from '../reducer/catalogSlice';
import CategoryCard from '../components/ui/CategoryCard';
import SceletonLoader from '../components/ui/SceletonLoader';
import { Button } from '@mui/material';

import appleLogo from "../assets/main/appleLogo.png"
import boombox from '../assets/main/boomBox.png'

export default function Home() {
  const { t } = useTranslation()
  const productsStore = useSelector((store:RootState) => store.products)
  const catalogStore = useSelector((store:RootState) => store.catalog)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getProducts({pageNumber: 1, pageSize: 10}))
    dispatch(getCategories())
  }, [dispatch])

  return (
    <main className="w-full max-w-full overflow-x-hidden pb-12 px-4 sm:px-6 lg:px-0">
      {/* 1. Hero 3D Models Swiper */}
      <section className="max-w-300 w-full min-w-0 my-4 sm:my-6 lg:my-10 mx-auto bg-black rounded-2xl text-white p-5 sm:p-8 lg:p-14 overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          className='w-full max-w-full min-w-0'
          autoplay={{
            delay: 3500, 
            disableOnInteraction: false, 
          }}
          loop={true}
        >
          <SwiperSlide className="w-full min-w-0">
            <div className='flex flex-col lg:flex-row justify-between w-full min-w-0 items-center gap-6 lg:gap-8'>
              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 w-full lg:w-1/2 text-center lg:text-left items-center lg:items-start">
                <div className="flex items-center gap-3 sm:gap-4">
                  <img src={appleLogo} alt="Apple" className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                  <p className="text-sm sm:text-base font-medium">iPhone 17 Series</p>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold leading-tight">
                  Up to 10% off Voucher
                </h1>
                <NavLink to="/catalog" className="text-base sm:text-lg lg:text-2xl font-semibold hover:underline mt-1 inline-flex items-center gap-2">
                  <span>{t('header.shopNow')}</span> &rarr;
                </NavLink>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center items-center h-60 sm:h-72 lg:h-96 min-w-0 overflow-hidden">
                <IphoneModel/>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="w-full min-w-0">
            <div className='flex flex-col lg:flex-row justify-between w-full min-w-0 items-center gap-6 lg:gap-8'>
              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 w-full lg:w-1/2 text-center lg:text-left items-center lg:items-start">
                <div className="flex items-center gap-3 sm:gap-4">
                  <img src={appleLogo} alt="Apple" className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                  <p className="text-sm sm:text-base font-medium">MacBook M5 Pro Series</p>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold leading-tight">
                  Up to 25% off Voucher
                </h1>
                <NavLink to="/catalog" className="text-base sm:text-lg lg:text-2xl font-semibold hover:underline mt-1 inline-flex items-center gap-2">
                  <span>{t('header.shopNow')}</span> &rarr;
                </NavLink>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center items-center h-60 sm:h-72 lg:h-96 min-w-0 overflow-hidden">
                <MacBookModel/>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* 2. Flash Sales */}
      <section className="flex flex-col gap-6 lg:gap-10 max-w-300 w-full min-w-0 mx-auto py-6 lg:py-10 overflow-hidden">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900">{t('home.flashSales')}</h2>
        {productsStore.loadings.loadingProducts ? <SceletonLoader/> : (
          <div className="w-full min-w-0 overflow-hidden">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={14}
              breakpoints={{
                320: { slidesPerView: 1.15, spaceBetween: 12 },
                480: { slidesPerView: 1.6, spaceBetween: 14 },
                640: { slidesPerView: 2.3, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className='w-full min-w-0'
              autoplay={{
                delay: 2500,
                disableOnInteraction: true, 
              }}
              loop={true}
            >
              {productsStore.dataProduct?.map((product:IProduct) => (
                  <SwiperSlide key={product.id} className="min-w-0">
                    <ProductCard product={product}/>
                  </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        <div className='flex justify-center w-full mt-2'>
          <NavLink to="/catalog">
            <PrimaryButton text={t('home.viewAllProducts')}/>
          </NavLink>
        </div>
      </section>

      {/* 3. Browse By Category */}
      <section className='flex max-w-300 w-full min-w-0 mx-auto py-6 lg:py-10 flex-col gap-6 lg:gap-10 overflow-hidden'>
        <h2 className='text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900'>{t('home.browseByCategory')}</h2>
        {catalogStore.loaders.categoryLoading ? (<SceletonLoader/>) : (
          <div className="w-full min-w-0 overflow-hidden">
            <Swiper
              spaceBetween={12}
              breakpoints={{
                320: { slidesPerView: 2.2, spaceBetween: 10 },
                480: { slidesPerView: 3.2, spaceBetween: 12 },
                640: { slidesPerView: 4.2, spaceBetween: 14 },
                1024: { slidesPerView: 6, spaceBetween: 18 },
              }}
              className='w-full min-w-0'
            >
              {
                catalogStore.categories?.map((category:ICategory) => (
                  <SwiperSlide key={category.id} className="min-w-0">
                    <CategoryCard category={category}/>
                  </SwiperSlide>
                ))
              }            
            </Swiper>
          </div>
        )}
      </section>

      {/* 4. Best Selling Products */}
      <section className='flex flex-col gap-6 lg:gap-10 max-w-300 w-full min-w-0 mx-auto py-6 lg:py-10 overflow-hidden'>
        <div className='flex justify-between w-full items-center'>
          <h2 className='text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900'>{t('home.bestSelling')}</h2>
          <NavLink to="/catalog">
            <PrimaryButton text={t('home.viewAll')}/>
          </NavLink>
        </div>
        {productsStore.loadings.loadingProducts ? <SceletonLoader/> : (
          <div className="w-full min-w-0 overflow-hidden">
            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 2500,
                disableOnInteraction: true,
              }}
              spaceBetween={14}
              breakpoints={{
                320: { slidesPerView: 1.15, spaceBetween: 12 },
                480: { slidesPerView: 1.6, spaceBetween: 14 },
                640: { slidesPerView: 2.3, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className='w-full min-w-0'
            >
              {
                productsStore.dataProduct?.slice(2, 11).map((product:IProduct) => (
                  <SwiperSlide key={product.id} className="min-w-0">
                    <ProductCard product={product}/>
                  </SwiperSlide>
                ))
              }
            </Swiper>
          </div>
        )}
      </section>

      {/* 5. Music Promo Banner */}
      <section className='flex flex-col-reverse lg:flex-row justify-between gap-6 sm:gap-8 lg:gap-14 p-6 sm:p-10 lg:p-14 items-center my-6 lg:my-10 max-w-300 w-full min-w-0 mx-auto rounded-2xl bg-black text-center lg:text-left overflow-hidden'>
        <div className='flex flex-col items-center lg:items-start gap-4 lg:gap-6 w-full lg:w-1/2'>
          <p className='text-xs sm:text-sm font-bold text-[#00FF66] tracking-wider uppercase'>{t('home.categories')}</p>
          <h2 className='text-2xl sm:text-4xl lg:text-[50px] font-bold text-white leading-tight'>{t('home.enhanceMusic')}</h2>
          <NavLink to="/catalog">
            <Button
              variant='contained'
              sx={{
                fontWeight: 700,
                width: 170,
                py: 1.6,
                backgroundColor: '#00FF66',
                color: 'black',
                fontSize: 14,
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover':{
                  backgroundColor:"#00b94a",
                  color:'white'
                }
              }}
            >
              {t('home.buyNow')}
            </Button>
          </NavLink>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center items-center min-w-0 overflow-hidden">
          <img className='w-full max-w-xs sm:max-w-sm lg:max-w-md object-contain drop-shadow-[0_0_35px_#ffffff]' src={boombox} alt="Music Experience" />
        </div>
      </section>
    </main>
  )
}

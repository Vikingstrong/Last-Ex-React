import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/navigation'

import { NavLink } from "react-router"
import { useDispatch, useSelector } from "react-redux"
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
  
  const productsStore = useSelector((store:RootState) => store.products)
  const catalogStore = useSelector((store:RootState) => store.catalog)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getProducts({pageNumber: 1, pageSize: 10}))
    dispatch(getCategories())
  }, [])
  console.log(productsStore)

  return (
    <>
      <section className="max-w-300 my-10 m-auto bg-black rounded-lg text-white p-15 items-center">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          className='w-full'
          autoplay={{
            delay: 3000, 
            disableOnInteraction: false, 
          }}
          loop={true}
        >
          <SwiperSlide>
            <div className='flex justify-between w-full items-center'>
              <div className="flex flex-col gap-5 w-1/3">
                <div className="flex items-center gap-8">
                  <img src={appleLogo} alt="" />
                  <p>iPhone 17 Series</p>
                </div>
                <h1 className="text-6xl font-semibold">Up to 10% off Voucher</h1>
                <p className="text-2xl font-semibold">Shop Now</p>
              </div>
              <IphoneModel/>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className='flex justify-between w-full items-center'>
              <div className="flex flex-col gap-5 w-1/3">
                <div className="flex items-center gap-8">
                  <img src={appleLogo} alt="" />
                  <p>MacBook M5 Pro Series</p>
                </div>
                <h1 className="text-6xl font-semibold">Up to 25% off Voucher</h1>
                <p className="text-2xl font-semibold">Shop Now</p>
              </div>
              <MacBookModel/>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <section className="flex flex-col gap-10 max-w-300 m-auto py-10">
        <h1 className="text-5xl font-bold">Flash Sales</h1>
        {productsStore.loadings.loadingProducts ? <SceletonLoader/> : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={4}
            className='w-full'
            autoplay={{
              delay:2000,
              disableOnInteraction: true, 
            }}
            loop={true}
          >
            {productsStore.dataProduct?.map((product:IProduct) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product}/>
                </SwiperSlide>
            ))}
          </Swiper>
        )}
        <div className='flex justify-center w-full'>
          <NavLink to="/catalog">
            <PrimaryButton text="View All Products"/>
          </NavLink>
        </div>
      </section>

      <section className='flex max-w-300 m-auto py-10 flex-col gap-10'>
        <h1 className='text-5xl font-bold'>Browse By Category</h1>
        {catalogStore.loaders.categoryLoading ? (<SceletonLoader/>) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={6}
            className='w-full'
          >
            {
              catalogStore.categories?.map((category:ICategory) => (
                <SwiperSlide key={category.id}>
                  <CategoryCard category={category}/>
                </SwiperSlide>
              ))
            }            
          </Swiper>
        )}
      </section>

      <section className='flex flex-col gap-10 max-w-300 m-auto py-10'>
        <div className='flex justify-between w-full items-center'>
          <h1 className='text-4xl font-bold'>Best Selling Products</h1>
          <NavLink to="/catalog">
            <PrimaryButton text='View All'/>
          </NavLink>
        </div>
        {productsStore.loadings.loadingProducts ? <SceletonLoader/> : (
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay:2000,
              disableOnInteraction: true,
            }}
            spaceBetween={20}
            slidesPerView={4}
            className='w-full'
          >
            {
              productsStore.dataProduct?.slice(2, 11).map((product:IProduct) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product}/>
                </SwiperSlide>
              ))
            }
          </Swiper>
        )}
      </section>

      <section className='flex justify-between gap-15 p-15 items-center my-10 max-w-300 m-auto rounded-xl bg-black'>
        <div className='flex flex-col items-start gap-5 w-1/2'>
          <p className='text-lg font-semibold text-[#00b94a]'>Categories</p>
          <h2 className='text-[56px] font-semibold text-white'>Enhance Your Music Experience</h2>
          <Button
            variant='contained'
            
            sx={{
              fontWeight: 700,
              width: 180,
              py: 2,
              backgroundColor: '#00FF66',
              color: 'black',
              fontSize: 16,
              transition: 'all 0.3s ease',
              '&:hover':{
                backgroundColor:"#00b94a",
                color:'white'
              }
            }}
          >
            Buy now
          </Button>
        </div>
        <img className='drop-shadow-[0_0_35px_#ffffff]' src={boombox} alt="" />
      </section>
    </>
  )
}

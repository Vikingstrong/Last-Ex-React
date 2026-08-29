import { createBrowserRouter, RouterProvider } from "react-router"
import Layout from "./Layout/Layout"
import { lazy } from "react"


const HomePg = lazy(() => import('./pages/Home'))
const CatalogPg = lazy(() => import('./pages/Catalog'))
const ProductDetailsPg = lazy(() => import('./pages/ProductDetails'))
const AboutPg = lazy(() => import('./pages/About'))
const ContactPg = lazy(() => import('./pages/Contact'))
const ProfilePg = lazy(() => import('./pages/Profile'))
const RegisterPg = lazy(() => import('./pages/Auth/Register'))
const LoginPg = lazy(() => import('./pages/Auth/Login'))


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        index: true,
        element: <HomePg/>
      },
      {
        path: "catalog",
        element: <CatalogPg/>
      },
      {
        path: "products",
        element: <CatalogPg/>
      },
      {
        path: "product/:id",
        element: <ProductDetailsPg/>
      },
      {
        path: "product-details",
        element: <ProductDetailsPg/>
      },
      {
        path: "about",
        element: <AboutPg/>
      },
      {
        path: "contact",
        element: <ContactPg/>
      },
      {
        path: "profile",
        element: <ProfilePg/>
      },
      {
        path: "account",
        element: <ProfilePg/>
      },
      {
        path: "register",
        element: <RegisterPg/>
      },
      {
        path: 'login',
        element: <LoginPg/>
      },
    ]
  }
])

export default function App() {


  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

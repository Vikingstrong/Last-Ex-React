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
const CartPg = lazy(() => import('./pages/Cart'))
const CheckoutPg = lazy(() => import('./pages/Checkout'))

// Admin Sub-pages
const AdminLayoutPg = lazy(() => import('./pages/Admin/AdminLayout'))
const AdminOverviewPg = lazy(() => import('./pages/Admin/AdminOverview'))
const AdminProductsPg = lazy(() => import('./pages/Admin/AdminProducts'))
const AdminUsersPg = lazy(() => import('./pages/Admin/AdminUsers'))
const AdminCategoriesPg = lazy(() => import('./pages/Admin/AdminCategories'))

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
        path: "cart",
        element: <CartPg/>
      },
      {
        path: "checkout",
        element: <CheckoutPg/>
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
      {
        path: 'admin',
        element: <AdminLayoutPg/>,
        children: [
          {
            index: true,
            element: <AdminOverviewPg/>
          },
          {
            path: 'products',
            element: <AdminProductsPg/>
          },
          {
            path: 'users',
            element: <AdminUsersPg/>
          },
          {
            path: 'categories',
            element: <AdminCategoriesPg/>
          }
        ]
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

import { createBrowserRouter, RouterProvider } from "react-router"
import Layout from "./Layout/Layout"
import { lazy } from "react"


const HomePg = lazy(() => import('./pages/Home'))

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
        path: "register",
        element: <RegisterPg/>
      },
      {
        path: 'login',
        element: <LoginPg/>
      }
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

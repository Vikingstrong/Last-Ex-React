import { Outlet, useNavigate } from "react-router";
import Header from "../components/Widgets/Header";
import { useEffect } from "react";




export default function Layout() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    return(
        <>
            <Header/>
            <Outlet/>
        </>
    )
}

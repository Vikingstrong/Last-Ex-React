import { Outlet } from "react-router";
import Header from "../components/Widgets/Header";
import Footer from "../components/Widgets/Footer";

export default function Layout() {
    return(
        <>
            <Header/>
            <Outlet/>
            <Footer/>
        </>
    )
}

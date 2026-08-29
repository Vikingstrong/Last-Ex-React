import { Outlet } from "react-router";
import Header from "../components/Widgets/Header";
import Footer from "../components/Widgets/Footer";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
            <Header/>
            <div className="flex-1 w-full max-w-full overflow-x-hidden">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}

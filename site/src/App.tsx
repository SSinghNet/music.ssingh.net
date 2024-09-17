import { Outlet } from "react-router-dom";
import Footer from './components/footer';
import Navbar from "./components/navbar";

export default function App() {
    return (
        <div className="bg-background h-full w-full">
            <Navbar />
            <div id="main" className="pt-20 pb-20 h-full">
                <div id="container" className="bg-white m-auto w-[90vw] rounded-3xl p-5 drop-shadow-md h-full">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}

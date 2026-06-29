import { Outlet } from "react-router-dom";
import Footer from './components/footer';
import Navbar from "./components/navbar";

export default function App() {
    return (
        <div className="bg-secondary min-h-screen w-full">
            <Navbar />
            <div id="main" className="pt-20 pb-20">
                <div id="container" className="px-4 md:px-6">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}

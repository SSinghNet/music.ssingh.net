import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Error from "./pages/Error.tsx";
import AlbumSingle from "./pages/album/AlbumSingle.tsx";
import Home from "./pages/Home.tsx";
import ArtistSingle from "./pages/artist/ArtistSingle.tsx";
import TagSingle from "./pages/tag/TagSingle.tsx";
import Chart from "./pages/charts/Chart.tsx";
import Search from "./pages/Search.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="/album/:albumID" element={<AlbumSingle />} />
                <Route path="artist" element={<Outlet />}>
                    <Route path=":artistID" element={<ArtistSingle />} />
                </Route>
                <Route path="/tag/:tagID" element={<TagSingle />} />
                <Route path="/charts/:chartYear" element={<Chart />} />
                <Route path="/search" element={<Search />} />
                <Route path="*" element={<Error />} />
            </Route>
        </Routes>
    </BrowserRouter>
)

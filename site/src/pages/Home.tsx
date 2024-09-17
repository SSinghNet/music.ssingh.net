import { useEffect, useState } from "react";
import { fetchAlbums, getAlbumPages } from "../middleware/album";
import { Album } from '../config/site';
import AlbumCard from "../components/album/albumCard";
import Loading from "../components/loading";
import PageButton from "../components/pageButton";

export default function Home() {
    const [albums, setAlbums] = useState<null | Album[]>(null);
    const [page, setPage] = useState(parseInt(localStorage.getItem("page")!) | 0);

    const [totalPages, setTotalPages] = useState(0);

    const initAlbums = async () => {
        setAlbums(await fetchAlbums({ page: page }));
    };

    const initTotalPages = async () => {
        setTotalPages(await getAlbumPages());
    }

    useEffect(() => {
        localStorage.setItem("page", page.toString());
        setAlbums(null);
        initTotalPages();
        initAlbums();
    }, [page]);

    if (albums) {

        const pageButtons =
            <div className="text-center justify-center m-auto mt-4">
                {page > 0 && page < totalPages ?
                    <PageButton onClick={() => setPage(page - 1)} value={"<"} />
                    : ""
                }
                {page < totalPages - 1 ?
                    <PageButton onClick={() => setPage(page + 1)} value={">"} />
                    : ""
                }<br/>
                <h2 className="opacity-70 text-xs">pg {page + 1}</h2>
            </div>;

        return (
            <>
                <h1 className="text-4xl mt-8 text-center font-bold underline">Recently Reviewed Albums</h1><br />
                {pageButtons}
                <div className="grid-album">
                    {albums.map((album: Album) => {
                        return <AlbumCard alb={album} />
                    })}
                </div>
                {pageButtons}
            </>
        );
    }

    return (
        <Loading />
    );
}
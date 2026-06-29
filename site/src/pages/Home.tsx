import { useEffect, useState } from "react";
import { fetchAlbums, getAlbumPages } from "../middleware/album";
import { Album, SortBy, SortOrder, sortOption, sortOptions } from '../config/site';
import AlbumCard from "../components/album/albumCard";
import SkeletonCard from "../components/skeletonCard";
import PageButton from "../components/pageButton";
import { Helmet } from "react-helmet";

export default function Home() {
    const [albums, setAlbums] = useState<null | Album[]>(null);
    const [page, setPage] = useState(parseInt(localStorage.getItem("page")!) | 0);
    const [totalPages, setTotalPages] = useState(0);

    const [sortBy, setSortBy] = useState<SortBy>("releaseDate");
    const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");
    const [sortValue, setSortValue] = useState(`${sortBy}|${sortOrder}`);

    const initAlbums = async () => {
        setAlbums(await fetchAlbums({ page, sortBy, sortOrder }));
    };

    const initTotalPages = async () => {
        setTotalPages(await getAlbumPages());
    }

    const setSort = (value: string) => {
        setSortValue(value);
        const [by, order] = value.split("|");
        setSortBy(by as SortBy);
        setSortOrder(order as SortOrder);
        setPage(0);
    };

    useEffect(() => {
        localStorage.setItem("page", page.toString());
        setAlbums(null);
        initTotalPages();
        initAlbums();
    }, [page, sortValue]);

    const pageButtons =
        <div className="text-center justify-center m-auto mt-4">
            {page > 0 && page < totalPages ?
                <PageButton onClick={() => setPage(page - 1)} value={"<"} />
                : ""
            }
            {page < totalPages - 1 ?
                <PageButton onClick={() => setPage(page + 1)} value={">"} />
                : ""
            }<br />
            <h2 className="text-white opacity-70 text-xs">pg {page + 1}</h2>
        </div>;

    const sortControl = (
        <div className="text-center mt-4">
            <label htmlFor="home-sort" className="text-white/70">sort: </label>
            <select
                name="home-sort"
                id="home-sort"
                className="p-2 border border-white/20 rounded-lg m-2 bg-black text-white"
                value={sortValue}
                onChange={(e) => setSort(e.target.value)}
            >
                {sortOptions.map((opt: sortOption) => (
                    <option key={opt.label} value={`${opt.sortBy}|${opt.sortOrder}`}>{opt.label}</option>
                ))}
            </select>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Home - SSingh.Net Music</title>
            </Helmet>
            <h1 className="text-4xl mt-8 text-center font-bold text-white underline decoration-primary underline-offset-4">Recently Reviewed Albums</h1><br />
            {sortControl}
            {pageButtons}
            <div className="grid-album">
                {albums
                    ? albums.map((album: Album) => <AlbumCard alb={album} key={album.id} />)
                    : Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                }
            </div>
            {albums && pageButtons}
        </>
    );
}

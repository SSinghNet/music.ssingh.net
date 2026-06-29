import { useEffect, useState } from "react";
import { Artist } from "../../config/site";
import { fetchArtists, getArtistPages } from "../../middleware/artist";
import ArtistDirectoryCard from "../../components/artist/artistDirectoryCard";
import Loading from "../../components/loading";
import PageButton from "../../components/pageButton";

export default function ArtistDirectory() {
    const [artists, setArtists] = useState<null | Artist[]>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        setArtists(null);
        getArtistPages().then(setTotalPages);
        fetchArtists({ page }).then(setArtists);
    }, [page]);

    const pageButtons = (
        <div className="text-center justify-center m-auto mt-4">
            {page > 0 && <PageButton onClick={() => setPage(page - 1)} value={"<"} />}
            {page < totalPages - 1 && <PageButton onClick={() => setPage(page + 1)} value={">"} />}
            <br />
            <h2 className="text-white opacity-70 text-xs">pg {page + 1} / {totalPages}</h2>
        </div>
    );

    return (
        <>
            <h1 className="text-4xl mt-8 text-center font-bold text-white underline decoration-primary underline-offset-4">Artists</h1>
            {pageButtons}
            {artists
                ? <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-4">
                    {artists.map((artist: Artist) => (
                        <ArtistDirectoryCard artist={artist} key={artist.id} />
                    ))}
                </div>
                : <Loading />
            }
            {totalPages > 1 && pageButtons}
        </>
    );
}

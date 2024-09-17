import { useSearchParams } from "react-router-dom";
import Loading from "../components/loading";
import { useEffect, useState } from "react";
import { Album, SearchResult } from "../config/site";
import { search } from "../middleware/search";
import AlbumCard from "../components/album/albumCard";
import ArtistChipContainer from '../components/artist/artistChipContainer';
import TagChipContainer from "../components/tag/tagChipContainer";

export default function Search() {
    const [searchParams,] = useSearchParams();
    const [results, setResults] = useState<SearchResult | null>(null);

    const query = searchParams.get("query");

    const initResults = async () => {
        setResults(await search(query!));
    }

    useEffect(() => {
        if (query) {
            initResults();
        }
    });


    const noResults = (<h3 className="text-center text-md">No Results</h3>);

    if (query) {
        if (results) {

            return (
                <>
                    <h1 className="text-4xl mt-8 text-center font-bold underline">
                        Search Results for: <span className="font-normal no-underline decoration-0">{query}</span>
                    </h1><br />
                    <h2 className={"text-2xl underline text-center m-4"}>albums:</h2>
                    {results.albums.length > 0 ?
                        <div className="grid-album">
                            {results.albums.splice(0, 5).map((album: Album) => {
                                return <AlbumCard alb={album} />
                            })}
                        </div> : noResults}
                    <h2 className={"text-2xl underline text-center m-4"}>artists:</h2>
                    {results.artists.length > 0 ?
                        <ArtistChipContainer artists={results.artists.splice(0, 5)} /> : noResults}
                    <h2 className={"text-2xl underline text-center m-4"}>tags:</h2>
                    {results.tags.length > 0 ?
                        <TagChipContainer tags={results.tags.splice(0, 5)} /> : noResults}
                </>
            );
        }

        return <Loading />
    }

    return (<h1>No search query.</h1>);
}
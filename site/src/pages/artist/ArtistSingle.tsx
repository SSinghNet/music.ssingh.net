import { useParams } from "react-router-dom";
import { Album, Artist, SortBy, sortOptions, SortOrder, sortOption } from '../../config/site';
import { fetchSingleArtist } from "../../middleware/artist";
import { useEffect, useState } from "react";
import Loading from "../../components/loading";
import AlbumCard from "../../components/album/albumCard";
import BackButton from '../../components/backButton';

export default function ArtistSingle() {
    const [artist, setArtist] = useState<null | Artist>(null);
    const { artistID } = useParams();

    const [sortBy, setSortBy] = useState<SortBy>("releaseDate");
    const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");
    const [sortValue, setSortValue] = useState(`${sortBy}|${sortOrder}`);

    const initArtist = async () => {
        setArtist(await fetchSingleArtist({ id: parseInt(artistID!), sortBy: sortBy, sortOrder: sortOrder }));
    };

    const setSort = (sortValue: string) => {
        setSortValue(sortValue);
        const [by, order] = sortValue.split("|");

        setSortBy(by as SortBy);
        setSortOrder(order as SortOrder);
    }

    useEffect(() => {
        setArtist(null);
        initArtist();
    }, [sortValue, artistID]);

    if (artist) {
        return (<>
            <BackButton />
            <div className="flex flex-col flex-wrap justify-center align-middle gap-5 mb-5">
                <img src={artist.image} width={200} className="m-auto" />
                <h1 className="m-auto text-2xl text-white">{artist.name}</h1>
            </div>

            <div className="align-middle text-center">
                <label htmlFor="sort" className="text-white/70">sort:</label>
                <select name="sort" id="sort" className="p-2 border border-white/20 rounded-lg m-2 bg-black text-white" value={sortValue} onChange={(e) => { setSort(e.target.value) }}>
                    {sortOptions.map((sortOption: sortOption) => {
                        return <option key={sortOption.label} value={`${sortOption.sortBy}|${sortOption.sortOrder}`}>{sortOption.label}</option>;
                    })}
                </select>
            </div>

            <div className="grid-album" key={`${artist.id}${sortValue}`}>
                {artist.albums!.map((album: Album) => {
                    return <AlbumCard alb={album} reload={true} key={album.id} />
                })}
            </div>
        </>
        );
    }

    return (<Loading />);
}
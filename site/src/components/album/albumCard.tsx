import { Link } from "react-router-dom";
import { Album } from "../../config/site";
import ArtistChipContainer from '../artist/artistChipContainer';
import TagChipContainer from '../tag/tagChipContainer';
import { useEffect, useState } from "react";
import { fetchSingleAlbum } from "../../middleware/album";

export default function AlbumCard({ alb, reload = false, rank }: { alb: Album, reload?: boolean, rank?: number }) {

    const [album, setAlbum] = useState(alb);

    const initAlbum = async () => {
        setAlbum(await fetchSingleAlbum(album.id));
    };

    useEffect(() => {
        if (album.artists == undefined || album.tags == undefined || { reload }) {
            initAlbum();
        }
    }, []);

    return (
        <div className="bg-black m-2 text-white rounded-xl shadow-background shadow-md drop-shadow-md text-center p-2 mt-20 pt-36 flex flex-col flex-wrap justify-between">
            <Link to={`/album/${album.id}`} >
                <div className="w-full aspect-square bg-transparent album-image h-0">
                    <img
                        src={album.image}
                        width={200}
                        className="align-middle aspect-square shadow-background shadow-lg drop-shadow-md w-[200px]"
                    />
                    {rank != null ?
                        <div className="w-[200px] aspect-square bg-black bg-opacity-50 flex justify-center align-middle items-center text-8xl rank">
                            {rank}
                        </div>
                        : ""}
                </div>
                <h1 className="text-2xl my-3 mx-1 overflow-ellipsis">
                    {album.name}
                </h1>
            </Link>
            <ArtistChipContainer artists={album.artists!} key={`${album.id}-artist`} />
            <TagChipContainer tags={album.tags!} key={`${album.id}-tag`} />
            <div className="flex flew-row justify-between m-3">
                <h6 className="text-sm my-auto">
                    {album.releaseDate}
                </h6>
                <div className="border-primary border-2 rounded-full p-1.5 aspect-square">
                    <h6 className="text-sm relative album-score">
                        {album.score}%
                    </h6>
                </div>
            </div>
        </div>
    );
}
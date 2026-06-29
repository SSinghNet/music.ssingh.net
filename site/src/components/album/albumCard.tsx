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
        if (album.artists == undefined || album.tags == undefined || reload) {
            initAlbum();
        }
    }, []);

    return (
        <div className="group bg-black text-white rounded-lg overflow-hidden transition-all duration-200 hover:brightness-110 m-2 flex flex-col border-t-4 border-primary">
            <Link to={`/album/${album.id}`}>
                <div className="relative">
                    <img
                        src={album.image}
                        className="w-full aspect-square object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 right-2 bg-primary rounded-full w-12 h-12 flex items-center justify-center shadow-md ring-2 ring-black">
                        <span className="text-xs font-bold text-white leading-none">{album.score}%</span>
                    </div>
                    {rank != null ? (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-8xl font-bold">
                            {rank}
                        </div>
                    ) : null}
                </div>
                <h1 className="text-lg font-semibold p-3 pb-1 line-clamp-2 text-left">
                    {album.name}
                </h1>
            </Link>
            <div className="px-2">
                <ArtistChipContainer artists={album.artists!} key={`${album.id}-artist`} />
                <TagChipContainer tags={album.tags!} key={`${album.id}-tag`} />
            </div>
            <div className="px-3 py-2 mt-auto">
                <span className="text-xs opacity-50">{album.releaseDate}</span>
            </div>
        </div>
    );
}

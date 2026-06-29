import { Link } from "react-router-dom";
import { Artist } from "../../config/site";

export default function ArtistDirectoryCard({ artist }: { artist: Artist }) {
    const initials = artist.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <Link to={`/artist/${artist.id}`}>
            <div className="bg-secondary rounded-lg overflow-hidden transition-all duration-200 hover:brightness-125">
                {artist.image ? (
                    <img src={artist.image} className="w-full aspect-square object-cover" />
                ) : (
                    <div className="w-full aspect-square bg-black flex items-center justify-center">
                        <span className="text-white text-3xl font-bold opacity-40">{initials}</span>
                    </div>
                )}
                <div className="p-2 px-3">
                    <p className="text-white text-sm font-semibold truncate">{artist.name}</p>
                </div>
            </div>
        </Link>
    );
}

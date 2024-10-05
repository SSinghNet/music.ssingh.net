import { Link } from "react-router-dom";
import { Artist } from "../../config/site";
import GenericChip from "../generic/genericChip";

export default function ArtistChip({ artist }: { artist: Artist }) {
    return (
        <Link to={`/artist/${artist.id}`} key={artist.id}>
            <GenericChip text={artist.name} image={artist.image} size="text-md" />
        </Link>
    );
}
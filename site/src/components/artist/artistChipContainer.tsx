import { Artist } from "../../config/site";
import ArtistChip from "./artistChip";

export default function ArtistChipContainer({ artists, align = "center" }: { artists: Artist[], align?: "start" | "center" }) {
    return (
        <div className={`my-2 flex flex-row flex-wrap justify-${align} text-white`}>
            {artists?.map((artist) => {
                return (
                    <ArtistChip artist={artist} key={artist.id} />
                );
            })}
        </div>
    );
}
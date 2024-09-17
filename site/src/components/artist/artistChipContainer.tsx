import { Artist } from "../../config/site";
import ArtistChip from "./artistChip";

export default function ArtistChipContainer({ artists }: { artists: Artist[] }) {
    return (
        <div className="my-4 flex flex-row flex-wrap justify-center text-white">
            {artists?.map((artist) => {
                return (
                    <ArtistChip artist={artist} />
                );
            })}
        </div>
    );
}
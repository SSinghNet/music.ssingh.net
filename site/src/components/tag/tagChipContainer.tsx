import { Tag } from "../../config/site";
import TagChip from "./tagChip";

export default function TagChipContainer({ tags }: { tags: Tag[] }) {
    return (
        <div className="flex flex-row flex-wrap justify-center text-white">
            {tags?.map((tag) => {
                return (
                    <TagChip tag={tag} />
                );
            })}
        </div>
    );
}
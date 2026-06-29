import { Tag } from "../../config/site";
import TagChip from "./tagChip";

export default function TagChipContainer({ tags, align = "center" }: { tags: Tag[], align?: "start" | "center" }) {
    return (
        <div className={`flex flex-row flex-wrap justify-${align} text-white`}>
            {tags?.map((tag) => {
                return (
                    <TagChip tag={tag} key={tag.id} />
                );
            })}
        </div>
    );
}
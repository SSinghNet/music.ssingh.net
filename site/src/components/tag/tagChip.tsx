import { Link } from "react-router-dom";
import { Tag } from "../../config/site";
import GenericChip from "../generic/genericChip";

export default function TagChip({ tag }: { tag: Tag }) {
    return (
        <Link to={`/tag/${tag.id}`} key={tag.id}>
            <GenericChip text={tag.name} color={tag.color} size="text-xs" />
        </Link>
    );
}
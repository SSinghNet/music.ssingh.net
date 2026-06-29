import { Link } from "react-router-dom";
import { Tag } from "../../config/site";
import { getContrastColor } from "../generic/genericChip";

export default function TagDirectoryCard({ tag }: { tag: Tag }) {
    const textColor = tag.color ? getContrastColor(tag.color) : '#E5E6E4';

    return (
        <Link to={`/tag/${tag.id}`}>
            <div
                style={{ backgroundColor: tag.color ? `#${tag.color}` : undefined }}
                className="bg-secondary rounded-lg aspect-square flex items-center justify-center p-3 transition-all duration-200 hover:brightness-125 ring-1 ring-white/10"
            >
                <p style={{ color: textColor }} className="text-sm font-semibold text-center leading-tight">{tag.name}</p>
            </div>
        </Link>
    );
}

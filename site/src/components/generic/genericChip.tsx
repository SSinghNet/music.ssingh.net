export function getContrastColor(hex: string): string {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#222426' : '#E5E6E4';
}

export default function GenericChip(
    {
        text,
        image,
        color,
        size="text-sm",
    }:
        {
            text: string,
            image?: string,
            color?: string,
            size?: "text-xs" | "text-sm" | "text-md" | "text-lg"
        }
) {
    const displayText = text.length > 33 ? text.slice(0, 30) + "..." : text;
    const textColor = color ? getContrastColor(color) : '#E5E6E4';

    return (
        <div style={{ backgroundColor: color ? `#${color}` : undefined }} className="flex bg-white/10 rounded-md text-center p-1.5 px-2 m-1 w-fit transition-transform duration-150 hover:scale-105">
            {image ? <img src={image} width={30} height={30} className="aspect-square rounded-full ml-0 mx-1" /> : ""}
            <h6 style={{ color: textColor }} className={size + " mx-2 m-auto text-nowrap overflow-hidden text-ellipsis"}>{displayText}</h6>
        </div>
    );
}
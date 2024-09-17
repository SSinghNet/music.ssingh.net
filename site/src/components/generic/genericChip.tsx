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
    return (
        <div style={{ "backgroundColor": `#${color}` }} className="flex bg-secondary rounded-full text-center p-1.5 px-2 m-1 w-fit shadow-sm">
            {image ? <img src={image} width={30} height={30}  className="aspect-square rounded-full ml-0 mx-1" /> : ""}
            <h6 className={size + " mx-2 m-auto text-nowrap overflow-hidden text-ellipsis"}>{text}</h6>
        </div>
    );
}
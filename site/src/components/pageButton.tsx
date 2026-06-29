import { MouseEventHandler } from "react";

export default function PageButton({onClick, value} : {onClick?: MouseEventHandler<HTMLButtonElement>, value: string}) {
    return (
        <button onClick={onClick} className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 p-2 py-1 m-1 rounded font-bold text-lg">
            {value}
        </button>
    );
}
import { MouseEventHandler } from "react";

export default function PageButton({onClick, value} : {onClick?: MouseEventHandler<HTMLButtonElement>, value: string}) {
    return (
        <button onClick={onClick} className="bg-black text-white p-2 py-1 m-1 rounded-md font-bold text-lg shadow-sm shadow-search">
            {value}
        </button>
    );
}
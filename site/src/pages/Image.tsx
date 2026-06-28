import { useSearchParams } from "react-router-dom";
import { apiURL } from "../config/site";
import { useEffect } from "react";

export default function Image() {
    const [searchParams,] = useSearchParams();
    const key = searchParams.get("key");

    useEffect(() => {
        window.location.href = `${apiURL}img?key=${key}`;
    }, []);

    return null;
}
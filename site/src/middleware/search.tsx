import { apiURL, SearchResult } from "../config/site";

export const search = async (query: string) => {
    const res = await fetch(`${apiURL}search/?format=json&query=${encodeURIComponent(query)}`);
    return await res.json() as SearchResult;
};
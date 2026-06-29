import { apiURL, Artist, SortBy, SortOrder } from "../config/site";

export const fetchArtists = async ({ page, sortBy = "name", sortOrder = "ASC" }: { page?: number, sortBy?: string, sortOrder?: SortOrder }) => {
    const pageParam = page === undefined ? "all=true" : `page=${page}`;
    const res = await fetch(`${apiURL}artist/?format=json&${pageParam}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    return await res.json() as Artist[];
};

export const fetchAllArtists = async () => {
    const res = await fetch(`${apiURL}artist/?format=json&all=true`);
    return await res.json() as Artist[];
}

export const getArtistPages = async () => {
    const res = await fetch(`${apiURL}artist/count`);
    return (await res.json() as { count: number, pages: number })["pages"];
}

export const fetchSingleArtist = async (
    { id, sortBy = "releaseDate", sortOrder = "DESC" }:
        { id: number, sortBy?: SortBy, sortOrder?: SortOrder }
) => {
    const res = await fetch(`${apiURL}artist/${id}?format=json&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    return await res.json() as Artist;
}

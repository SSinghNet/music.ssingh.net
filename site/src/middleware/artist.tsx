import { apiURL, Artist, SortBy, SortOrder } from "../config/site";

export const fetchSingleArtist = async (
    { id, sortBy = "releaseDate", sortOrder = "DESC" }:
        { id: number, sortBy?: SortBy, sortOrder?: SortOrder }
) => {
    const res = await fetch(`${apiURL}artist/${id}?format=json&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    return await res.json() as Artist;
}
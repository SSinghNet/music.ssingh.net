import { apiURL, SortBy, SortOrder, Tag } from "../config/site";

export const fetchSingleTag = async ({ id, sortBy = "releaseDate", sortOrder = "DESC" }:
    { id: number, sortBy?: SortBy, sortOrder?: SortOrder }) => {
    const res = await fetch(`${apiURL}tag/${id}?format=json&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    return await res.json() as Tag;
}
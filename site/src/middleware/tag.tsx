import { apiURL, SortBy, SortOrder, Tag } from "../config/site";

export const fetchTags = async ({ page, sortBy = "name", sortOrder = "ASC" }: { page?: number, sortBy?: string, sortOrder?: SortOrder }) => {
    const pageParam = page === undefined ? "all=true" : `page=${page}`;
    const res = await fetch(`${apiURL}tag/?format=json&${pageParam}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    return await res.json() as Tag[];
};

export const fetchAllTags = async () => {
    const res = await fetch(`${apiURL}tag/?format=json&all=true`);
    return await res.json() as Tag[];
}

export const getTagPages = async () => {
    const res = await fetch(`${apiURL}tag/count`);
    return (await res.json() as { count: number, pages: number })["pages"];
}

export const fetchSingleTag = async ({ id, sortBy = "releaseDate", sortOrder = "DESC" }:
    { id: number, sortBy?: SortBy, sortOrder?: SortOrder }) => {
    const res = await fetch(`${apiURL}tag/${id}?format=json&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    return await res.json() as Tag;
}

import { Album, apiURL } from "../config/site";

export const fetchAlbums = async ({ page=undefined }: { page?: number }) => {
    const pageParam = page === undefined ? "all=true" : `page=${page}`;
    const res = await fetch(`${apiURL}album/?format=json&${pageParam}`);
    return await res.json() as Album[];
};

export const fetchSingleAlbum = async (id : number) => {
    const res = await fetch(`${apiURL}album/${id}?format=json`);
    return await res.json() as Album;
}

export const getRandomAlbum = async () => {
    const res = await fetch(`${apiURL}random?format=json`);
    return (await res.json() as { id: number })["id"];
}

export const getAlbumPages = async () => {
    const res = await fetch(`${apiURL}album/count`);
    return (await res.json() as { count: number, pages: number })["pages"];
}

export const getAlbumCount = async () => {
    const res = await fetch(`${apiURL}album/count`);
    return (await res.json() as { count: number, pages: number })["count"];
}
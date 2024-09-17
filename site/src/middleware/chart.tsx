import { Album, apiURL } from "../config/site";

export const fetchChart = async ({ year = "all-time", page = 0 }: { year?: number | "all-time", page?: number }) => {
    const res = await fetch(`${apiURL}charts/?format=json&page=${page}&year=${year}`);
    return await res.json() as {count: number, pages: number, albums: Album[] };
}



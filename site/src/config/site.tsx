export const apiURL = "https://music-ssingh.onrender.com/";

export interface Artist {
    id: number,
    name: string,
    image: string,
    createdAt: Date,
    updatedAt: Date,
    albums: null | Array<Album>
}

export interface Tag {
    id: number,
    name: string,
    color: string,
    createdAt: Date,
    updatedAt: Date,
    rym: string,
    albums: null | Array<Album>
}

export interface Album {
    id: number,
    name: string,
    image: string,
    releaseDate: string,
    score: number,
    review?: string,
    createdAt: Date,
    updatedAt: Date,
    artists?: Array<Artist>,
    tags?: Array<Tag>
};

export interface List {
    id: number,
    name: string,
    description?: string,
    image?: string,
    albums: Array<Album>
};

export interface SearchResult {
    albums: Album[],
    artists: Artist[],
    tags: Tag[],
};

export type SortBy = "name" | "score" | "releaseDate";
export type SortOrder = "ASC" | "DESC";
export type sortOption = { label: string, sortBy: SortBy, sortOrder: SortOrder };
export const sortOptions: sortOption[] = [
    { label: "score (0-100)", sortBy: "score", sortOrder: "ASC" },
    { label: "score (100-0)", sortBy: "score", sortOrder: "DESC" },
    { label: "name (A-Z)", sortBy: "name", sortOrder: "ASC" },
    { label: "name (Z-A)", sortBy: "name", sortOrder: "DESC" },
    { label: "release date (oldest to newest)", sortBy: "releaseDate", sortOrder: "ASC" },
    { label: "release date (newest to old)", sortBy: "releaseDate", sortOrder: "DESC" },
];
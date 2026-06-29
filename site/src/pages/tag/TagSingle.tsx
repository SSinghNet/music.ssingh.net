import { Link, useParams } from "react-router-dom";
import { Album, Tag, SortBy, SortOrder, sortOption, sortOptions } from "../../config/site";
import { fetchSingleTag } from "../../middleware/tag";
import { useEffect, useState } from "react";
import Loading from "../../components/loading";
import AlbumCard from "../../components/album/albumCard";
import BackButton from '../../components/backButton';

export default function TagSingle() {
    const [tag, setTag] = useState<null | Tag>(null);
    const { tagID } = useParams();

    const [sortBy, setSortBy] = useState<SortBy>("releaseDate");
    const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");
    const [sortValue, setSortValue] = useState(`${sortBy}|${sortOrder}`);

    const initTag = async () => {
        setTag(await fetchSingleTag({ id: parseInt(tagID!), sortBy: sortBy, sortOrder: sortOrder }));
    };

    const setSort = (sortValue: string) => {
        setSortValue(sortValue);
        const [by, order] = sortValue.split("|");

        setSortBy(by as SortBy);
        setSortOrder(order as SortOrder);
    }

    useEffect(() => {
        setTag(null);
        initTag();
    }, [sortValue, tagID]);

    if (tag) {
        return (<>
            <BackButton />
            <div className="flex flex-col flex-wrap justify-center align-middle gap-5 mb-5">
                <h1 style={{ "textDecorationColor": `#${tag.color}`, textDecorationThickness: "3px" }} className="underline decoration-secondary m-auto text-2xl text-white">{tag.name}</h1>
                <Link to={tag.rym} target="_blank" className="text-center bg-secondary w-min p-2 text-white m-auto rounded-md text-sm hover:bg-primary transition-colors duration-200">RYM</Link>
            </div>

            <div className="align-middle text-center">
                <label htmlFor="sort" className="text-white/70">sort:</label>
                <select name="sort" id="sort" className="p-2 border border-white/20 rounded-lg m-2 bg-black text-white" value={sortValue} onChange={(e) => { setSort(e.target.value) }}>
                    {sortOptions.map((sortOption: sortOption) => {
                        return <option key={sortOption.label} value={`${sortOption.sortBy}|${sortOption.sortOrder}`}>{sortOption.label}</option>;
                    })}
                </select>
            </div>

            <div className="grid-album" key={tag.id}>
                {tag.albums!.map((album: Album) => {
                    return <AlbumCard alb={album} reload={true} key={album.id} />
                })}
            </div>
        </>
        );
    }

    return (<Loading />);
}
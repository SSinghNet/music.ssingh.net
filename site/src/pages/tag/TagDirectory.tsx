import { useEffect, useState } from "react";
import { Tag } from "../../config/site";
import { fetchTags, getTagPages } from "../../middleware/tag";
import TagDirectoryCard from "../../components/tag/tagDirectoryCard";
import Loading from "../../components/loading";
import PageButton from "../../components/pageButton";

export default function TagDirectory() {
    const [tags, setTags] = useState<null | Tag[]>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        setTags(null);
        getTagPages().then(setTotalPages);
        fetchTags({ page }).then(setTags);
    }, [page]);

    const pageButtons = (
        <div className="text-center justify-center m-auto mt-4">
            {page > 0 && <PageButton onClick={() => setPage(page - 1)} value={"<"} />}
            {page < totalPages - 1 && <PageButton onClick={() => setPage(page + 1)} value={">"} />}
            <br />
            <h2 className="text-white opacity-70 text-xs">pg {page + 1} / {totalPages}</h2>
        </div>
    );

    return (
        <>
            <h1 className="text-4xl mt-8 text-center font-bold text-white underline decoration-primary underline-offset-4">Tags</h1>
            {pageButtons}
            {tags
                ? <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mt-4">
                    {tags.map((tag: Tag) => (
                        <TagDirectoryCard tag={tag} key={tag.id} />
                    ))}
                </div>
                : <Loading />
            }
            {totalPages > 1 && pageButtons}
        </>
    );
}

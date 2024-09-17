import { useNavigate, useParams } from "react-router-dom";
import { Album } from "../../config/site";
import { useEffect, useState } from "react";
import { fetchChart } from "../../middleware/chart";
import AlbumCard from "../../components/album/albumCard";
import Loading from "../../components/loading";
import PageButton from "../../components/pageButton";

export default function Chart() {
    const [chart, setChart] = useState<null | Album[]>(null);
    const { chartYear } = useParams();

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const year = parseInt(chartYear!) > 1950 && parseInt(chartYear!) <= (new Date().getFullYear()) ? parseInt(chartYear!) : "all-time";
    const initChart = async () => {
        const res = (await fetchChart({ year: year, page: page }));
        setChart(res["albums"]);
        setTotalPages(res["pages"]);
    };

    // setChart(null);
    useEffect(() => {
        setChart(null);
        initChart();
    }, [year, page]);

    const navigate = useNavigate();

    const header = (
        <>
            <h1 className="text-4xl my-8 text-center font-bold underline">
                Top Albums of <span className="capitalize">{year}</span>
            </h1>
            <div className="align-middle text-center ">
                <label htmlFor="year">year:</label>
                <select name="year" className="p-2 border-background border-2 rounded-lg m-2" defaultValue={year} onChange={(e) => { navigate(`/charts/${e.target.value as number | "all-time"}`); }}>
                    <option value="all-time">All-Time</option>
                    {
                        Array.from(
                            { length: new Date().getFullYear() - 1950 + 1 }, (value) => value).map((value: unknown, index) => {
                                return <option value={new Date().getFullYear() - index}>{value as string}{new Date().getFullYear() - index}</option>;
                            }
                            )
                    }
                </select>
            </div>
        </>
    );

    if (chart) {
        const pageButtons =
            <div className="text-center justify-center m-auto mt-4">
                {page > 0 && page < totalPages ?
                    <PageButton onClick={() => setPage(page - 1)} value={"<"} />
                    : ""
                }
                {page < totalPages - 1 ?
                    <PageButton onClick={() => setPage(page + 1)} value={">"} />
                    : ""
                }<br />
                <h2 className="opacity-70 text-xs">pg {page + 1}</h2>
            </div>;

        return (
            <div key={chartYear}>
                {header}
                {pageButtons}
                {chart.length < 1 ? <h2 className="text-center m-6 text-xl">no albums for this year.</h2> :
                    <div className="grid-album" key={chartYear}>
                        {chart.map((album: Album, index: number) => {
                            return <AlbumCard alb={album} key={`${album.id}-${chartYear}`} rank={page*21 + index + 1} />
                        })}
                    </div>
                }
                {pageButtons}
            </div>
        );
    }

    return (
        <>
            {header}
            <div className="m-10"></div>
            <Loading />
            <div className="m-10"></div>
        </>
    );
}
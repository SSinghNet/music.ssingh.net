import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiURL } from "../config/site";
import { getRandomAlbum } from "../middleware/album";

export default function Navbar() {
    const navigate = useNavigate();
    const redirectToRandomAlbum = async () => {
        getRandomAlbum().then((id) => {
            navigate(`/album/${id}`);
        });
    };

    const [searchParams,] = useSearchParams();
    const query = searchParams.get("query");

    return (
        <div className="bg-secondary w-full p-2.5 fixed top-0 flex flex-row z-10 justify-between">
            <div className="flex">
                <img src={`${apiURL}images/slogo.png`} width={35} />
                <Link to="/" onClick={() => localStorage.setItem("page", "0")}>
                    <h1 className="text-2xl text-primary mx-3 my-auto">Music</h1>
                </Link>
            </div>
            <div className="ml-3 flex flex-row gap-5">
                <Link to={`/charts/${new Date().getFullYear()}`} className="my-auto text-white">charts</Link>
                <button className="my-auto text-white" onClick={redirectToRandomAlbum}>random</button>
            </div>
            <form className="search flex border-search border-2 focus-within:border-primary rounded-lg bg-search" action="/search">
                <input type="text" name="query" id="search" className="w-96 bg-search rounded-s-lg p-1 px-2 focus:outline-none" defaultValue={query!}/>
                <input type="submit" value="Search" className="bg-search p-1 px-2 text-sm rounded-e-lg" />
            </form>
        </div>
    );
}
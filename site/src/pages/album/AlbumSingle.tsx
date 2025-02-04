import { Link, useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { useEffect, useState } from "react";
import { fetchSingleAlbum } from "../../middleware/album";
import { Album, Artist } from "../../config/site";
import ArtistChipContainer from '../../components/artist/artistChipContainer';
import TagChipContainer from "../../components/tag/tagChipContainer";
import BackButton from '../../components/backButton';
import Helmet from 'react-helmet';

export default function AlbumSingle() {
    const [album, setAlbum] = useState<null | Album>(null);
    const { albumID } = useParams();

    const initAlbum = async () => {
        setAlbum(await fetchSingleAlbum(parseInt(albumID!)));
    };

    useEffect(() => {
        setAlbum(null);
        initAlbum();
    }, [albumID]);

    const artists = album?.artists!.map((a: Artist) => {
        return a.name;
    }).join(", ");

    const regex = /(<([^>]+)>)/gi;
    const desc = album?.review!.replace(regex, "");

    if (album) {
        return (
            <>
                <Helmet>
                    <title>{album.name} - {artists} - SSingh.Net Music</title>
                    <meta content={`${album.name} - ${artists}`} property="og:title" />
                    <meta content={`${desc}`} property="og:description" />
                    <meta content={`https://music.ssingh.net/album/${album.id}`} property="og:url" />
                    <meta content={`${album.image}`} property="og:image" />
                </Helmet>
                <BackButton />
                <div className="flex flex-col flex-wrap md:mx-12 my-3 md:my-8 md:mt-0">
                    <div className="flex flex-row flex-wrap md:m-8 gap-10 justify-stretch">
                        <img src={`${album.image}`} className="shadow-xl shadow-black m-auto max-w-[300px]" />
                        <div className="flex flex-col flex-wrap text-center align-middle justify-evenly m-auto">
                            <h1 className="text-5xl max-w-[500px] mt-4">
                                {album.name}
                            </h1>
                            <ArtistChipContainer artists={album.artists!} key={`${album.id}artsingle`} />
                            <h5 className="my-6">
                                <Link to={`/charts/${album.releaseDate.substring(0, 4)}`} className="font-bold underline decoration-primary">
                                    {album.releaseDate.substring(0, 4)}
                                </Link>
                                {album.releaseDate.substring(4)}
                            </h5>
                            <TagChipContainer tags={album.tags!} key={`${album.id}tagsingle`} />
                        </div>
                        {/* <div className="border-primary border-2 rounded-full p-8 aspect-square h-min m-auto">
                            <h3 className="relative album-score text-4xl">{album.score}%</h3>
                        </div> */}
                        <div className="border-primary border-2 rounded-full p-8 aspect-square m-auto">
                            <h6 className="text-4xl relative album-score">
                                {album.score}%
                            </h6>
                        </div>
                    </div>
                    <div className="flex flex-col flex-wrap mt-5">
                        <hr className="opacity-25" />
                        <p className="text-center my-4" dangerouslySetInnerHTML={{ "__html": album.review! }}>
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (<Loading />);
}
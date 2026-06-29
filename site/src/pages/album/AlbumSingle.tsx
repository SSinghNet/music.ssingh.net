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
                <div className="flex flex-col items-center text-center gap-4 my-6 max-w-lg mx-auto">
                    <img src={`${album.image}`} className="rounded-lg w-64 md:w-80" />
                    <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{album.name}</h1>
                    <ArtistChipContainer artists={album.artists!} key={`${album.id}artsingle`} />
                    <Link to={`/charts/${album.releaseDate.substring(0, 4)}`} className="text-white/40 text-sm hover:text-primary transition-colors duration-200">
                        {album.releaseDate}
                    </Link>
                    <TagChipContainer tags={album.tags!} key={`${album.id}tagsingle`} />
                    <span className="text-3xl font-bold text-primary">{album.score}%</span>
                </div>
                <hr className="border-white/10 my-4 max-w-2xl mx-auto" />
                <p className="my-4 leading-relaxed max-w-2xl mx-auto text-white/70 text-center" dangerouslySetInnerHTML={{ "__html": album.review! }} />
            </>
        );
    }

    return (<Loading />);
}
import * as ftp from "basic-ftp";

export const connectToMediaServer = async () => {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "ssingh.net",
            user: "onksin94",
            password: "freehostia",
            secure: false,
        });
        console.log(await client.list());
        await client.uploadFrom("/images/no_image.png", "media.ssingh.net/music/albums/test2.png");
    } catch (err) {
        console.log(err);
    }
    client.close();
};



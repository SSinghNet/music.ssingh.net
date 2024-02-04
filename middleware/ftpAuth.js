import * as ftp from "basic-ftp";
import * as https from "https";
import * as fs from "fs";

export const uploadFileToMediaServer = async () => {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "ssingh.net",
            user: "onksin94",
            password: "freehostia",
            secure: false,
        });

        const file = fs.createWriteStream("file.jpg");
        const request = https.get("https://e.snmc.io/i/600/w/3e05081dfc0a8b74a3f1301702a3f40e/11440905/tapir-the-pilgrim-their-god-and-the-king-of-my-decrepit-mountain-Cover-Art.jpg", (response) => {
            response.pipe(file);

            // after download completed close filestream
            file.on("finish", async () => {
                file.close();
                console.log("Download Completed");
                await client.uploadFrom("file.jpg", "media.ssingh.net/music/albums/test4.jpg");

            });

        });

        fs.unlink("file.jpg", () => { });

    } catch (err) {
        console.log(err);
    }
    client.close();
};



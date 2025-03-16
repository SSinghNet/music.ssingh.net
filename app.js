import * as fs from "fs";
// process.on('uncaughtException', (err, origin) => {
//     fs.writeSync(
//         process.stderr.fd,
//         `Caught exception: ${err}\n` +
//         `Exception origin: ${origin}\n`,
//     );
// });

import express from "express";
import bodyParser from "body-parser";
import * as url from "url";

import path from "path";
import cors from "cors";

import * as discord from "./controllers/discord.js";

import * as index from "./routes/index.js";
import * as album from "./routes/album.js";
import * as artist from "./routes/artist.js";
import * as tag from "./routes/tag.js";
import * as databaseValues from "./routes/databaseValues.js";
import * as search from "./routes/search.js";
import * as random from "./routes/random.js";
import * as charts from "./routes/charts.js";
import * as lists from "./routes/lists.js";
import * as year from "./routes/year.js";
import * as img from "./routes/img.js";

export const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

discord.client.login(process.env.DISCORD_TOKEN);

const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));

const cacheTime = 86400000 * 30;
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: cacheTime
}));

app.use(cors());

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use("/img", img.router);
app.use("/", index.router);
app.use("/album", album.router);
app.use("/artist", artist.router);
app.use("/tag", tag.router);
app.use("/db", databaseValues.router);
app.use("/search", search.router);
app.use("/random", random.router);
app.use("/charts", charts.router);
app.use("/lists", lists.router);
app.use("/year", year.router);

app.use("/status", (req, res) => {
    res.status(200).send("Server Up.");
})

app.all("*", (req, res) => {
    res.status(500).render("500");
    res.status(404).render("404", { type: "Page" });

});

app.listen(7002);

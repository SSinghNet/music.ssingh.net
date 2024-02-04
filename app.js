import express from "express";
import bodyParser from "body-parser";
import * as url from "url";

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
import * as admin from "./routes/admin.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

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
app.use("/admin", admin.router);

app.all("*", (req, res) => {
    res.status(404).render("404", {type: "Page"});
});

app.listen(7000);
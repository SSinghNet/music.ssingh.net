import express from "express";
import { Album, Artist, Tag, sequelize } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res) => {
    let albums;
    let pageTitle = "Top Albums of ";

    if (isNaN(req.query.year) || (req.query.year).length != 4) {
        req.query.year = null;
    }

    if (req.query.year != null) {
        albums = await Album.findAll({
            // where: sequelize.where(sequelize.literal("CAST(SUBSTR(releaseDate, 1, 4) AS integer)"), req.query.year),
            where: sequelize.where(sequelize.literal("CAST(SUBSTR(releaseDate, 1, 4) AS CHAR)"), req.query.year),
            order: [
                ['score', 'DESC'],
            ],
            include: [Artist, Tag]
        });
        pageTitle += req.query.year;
    } else {
        albums = await Album.findAll({
            order: [
                ['score', 'DESC'],
            ],
            include: [Artist, Tag]
        });
        pageTitle += "All-Time"; 
    }

    res.render("charts", {"title": "Charts - ", "albums": albums, "pageTitle": pageTitle});
});
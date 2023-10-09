import express from "express";
import { Album, Artist, Tag, sequelize } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res) => {
    let albums;
    let pageTitle = "Top Albums of ";

    if (req.query.year != null) {
        albums = await Album.findAll({
            where: sequelize.where(sequelize.fn("YEAR", sequelize.col("releaseDate")), req.query.year),
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
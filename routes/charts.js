import express from "express";
import { Album, Artist, Tag, sequelize } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res) => {
    let albums;
    let pageTitle = "Top Albums of ";

    let page = 0
    let amount = 20

    let year = null;

    if (isNaN(req.query.year) || (req.query.year).length != 4) {
        req.query.year = null;
    }

    let count = 0;

    if (req.query.year != null) {
        count = await Album.count({
            where: sequelize.where(sequelize.literal("CAST(SUBSTR(releaseDate, 1, 4) AS CHAR)"), req.query.year),
        });

        let pageIn = req.query.page;

        try {
            if (pageIn != null) {
                if (typeof parseInt(pageIn) === "number" && (count / amount) > (pageIn)) {
                    page = parseInt(pageIn);
                }
            }
        } catch {
            console.log("L");
        }

        albums = await Album.findAll({
            // where: sequelize.where(sequelize.literal("CAST(SUBSTR(releaseDate, 1, 4) AS integer)"), req.query.year),
            where: sequelize.where(sequelize.literal("CAST(SUBSTR(releaseDate, 1, 4) AS CHAR)"), req.query.year),
            order: [
                ['score', 'DESC'],
            ],
            include: [Artist, Tag],
            limit: amount + 1,
            offset: page != 0 ? amount * page + 1: 0
        });
        pageTitle += req.query.year;
        year = req.query.year;
    } else {
        count = await Album.count();

        let pageIn = req.query.page;
    
        try {
            if (pageIn != null) {
                if (typeof parseInt(pageIn) === "number" && (count / amount) > (pageIn)) {
                    page = parseInt(pageIn);
                }
            }
        } catch {
            console.log("L");
        }

        albums = await Album.findAll({
            order: [
                ['score', 'DESC'],
            ],
            include: [Artist, Tag],
            limit: amount + 1,
            offset: page != 0 ? amount * page + 1: 0
        });
        pageTitle += "All-Time"; 
    }

    res.render("charts", {"title": "Charts - ", "albums": albums, "pageTitle": pageTitle, page: page, maxPage: count / amount, offset: (amount * page), year: year});
});
import express from "express";
import { Album, Artist, Tag, sequelize } from "../models/models.js";
import { PAGE_SIZE, parsePage } from "../utils/pagination.js";

export let router = express.Router();

router.get("/", async (req, res, next) => {
    let albums;
    let pageTitle = "Top Albums of ";

    let year = null;

    if (!req.query.year || isNaN(req.query.year) || req.query.year.length != 4) {
        req.query.year = null;
    }

    let count = 0;
    let page = 0;

    if (req.query.year != null) {
        count = await Album.count({
            where: sequelize.where(sequelize.literal("CAST(SUBSTR(releaseDate, 1, 4) AS CHAR)"), req.query.year),
        });

        page = parsePage(req.query.page, count);

        albums = await Album.findAll({
            where: sequelize.where(sequelize.literal("CAST(SUBSTR(releaseDate, 1, 4) AS CHAR)"), req.query.year),
            order: [
                ['score', 'DESC'],
            ],
            include: [Artist, Tag],
            limit: PAGE_SIZE + 1,
            offset: page != 0 ? PAGE_SIZE * page : 0
        });
        pageTitle += req.query.year;
        year = req.query.year;
    } else {
        count = await Album.count();

        page = parsePage(req.query.page, count);

        albums = await Album.findAll({
            order: [
                ['score', 'DESC'],
            ],
            include: [Artist, Tag],
            limit: PAGE_SIZE + 1,
            offset: page != 0 ? PAGE_SIZE * page : 0
        });
        pageTitle += "All-Time";
    }

    if (req.query.format == "json") {
        res.status(200).json({
            count: count,
            pages: Math.ceil(count / PAGE_SIZE),
            albums: albums,
        });
        return;
    }

    res.render("charts", {"title": "Charts - ", "albums": albums, "pageTitle": pageTitle, page: page, maxPage: count / PAGE_SIZE, offset: (PAGE_SIZE * page), year: year});
});
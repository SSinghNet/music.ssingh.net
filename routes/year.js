import express from "express";
import { Album, Artist, Tag, sequelize } from "../models/models.js";

export let router = express.Router();

router.get("/:year", async (req, res) => { 
    let year = req.params.year;

    if (isNaN(req.params.year) || (req.params.year).length != 4) {
        res.render("404", { "type": "Year" });
        return;
    } else {
        req.params.year = `${req.params.year} - `;
    }

    let albums = await Album.findAll({
        where: sequelize.where(sequelize.literal("CAST(SUBSTR(releaseDate, 1, 4) AS CHAR)"), year),
        order: [
            ['releaseDate', 'ASC'],
        ],
        include: [Artist, Tag]
    });

    res.render("year", {"title": `${req.params.year}`, "albums": albums, "year": year});
});
import express from "express";
import { Album, Artist, Tag, sequelize } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res) => {
    let albums;

    if (req.query.year != null) {
        let albums = await Album.findAll({ where: sequelize.where(sequelize.fn("YEAR", sequelize.col("releaseDate")), req.query.year) });
    }

    console.log(albums);

    res.render("charts", {"title": "Charts - ", "albums": albums});
});
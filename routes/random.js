import express from "express";
import { Sequelize } from "sequelize";
import { Album, Artist, Tag, sequelize } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res, next) => {
    const album = await Album.findOne({ order: [sequelize.random()] });
    if (album == null) {
        res.status(404).render("404", { type: "Album" });
        return;
    }
    if (req.query.format == "json") {
        res.status(200).json({ id: album.id });
        return;
    }
    res.redirect("/album/" + album.id);
});

 
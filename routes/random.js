import express from "express";
import { Sequelize } from "sequelize";
import { Album, Artist, Tag, sequelize } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res, next) => {
    Album.findOne({ order: [sequelize.random()] }).then((album) => {
        if (req.query.format == "json") {
            res.status(200).json({id: album.id});
            return;
        }
        res.redirect("/album/" + album.id);
    });
});

 
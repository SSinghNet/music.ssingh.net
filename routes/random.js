import express from "express";
import { Sequelize } from "sequelize";
import { Album, Artist, Tag, sequelize } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res) => {
    Album.findOne({order: [sequelize.random()]}).then((album) => {
        res.redirect("/album/" + album.id);
    });
});

 
import express from "express";
import { Album, Artist, Tag } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res) => {
    let albs = await Album.findAll({ include:[Artist, Tag], order: [
        ['updatedAt', 'DESC'],
    ]});

    res.render("index", { title: "Home - ", albums: albs });
});

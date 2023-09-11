import express from "express";
import { Album, Artist, Tag } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";

export let router = express.Router();

router.get("/:id", async (req, res) => {
    let art = await Artist.findOne({
        where: { id: req.params.id },
        include: [Album],
        order: [
            [{ model: Album }, 'releaseDate', 'ASC'],
        ]
    });

    if (art == null) {
        res.status(404).render("404", {type: "Artist"});
        return;
    }

    if (req.query.format == "json") {
        res.status(200).json(art);
        return;
    }

    // let albs = await Album.findAll({ where: { "$Artists.id$": art.id }, include: [Artist] });
    // console.log(albs[0].artists)
    
    res.status(200).render("artist", {artist: art});
});

router.post("/", restAuth, async (req, res) => {
    let art = Artist.build({
        name: req.body.name,
        image: req.body.image
    });

    await art.save();
    res.status(201).json(art);
});

router.put("/:id", restAuth, async (req, res) => {
    let art = await Artist.findOne({ where: { id: req.params.id }});
    if (art == null) {
        res.status(404).render("404", {type: "Artist"});
        return;
    }

    if (req.body.name != null) art.name = req.body.name;
    if (req.body.image != null) art.image = req.body.image;

    art.save();
    res.status(200).json(art);
});

router.delete("/:id", restAuth, async (req, res) => {
    let art = await Artist.findOne({ where: { id: req.params.id }});

    if (art == null) {
        res.status(404).render("404", {type: "Artist"});
        return;
    }

    art.destroy();
    res.status(204).send();
});
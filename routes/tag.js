import express from "express";
import { Album, Artist, Tag } from "../models/models.js";

export let router = express.Router();

router.get("/:id", async (req, res) => {
    let tag = await Tag.findOne({
        where: { id: req.params.id },
        include: [Album],
        order: [
            [{ model: Album }, 'releaseDate', 'ASC'],
        ]
    });


    if (tag == null) {
        res.status(404).render("404", {type: "Tag"});
        return;
    } 

    if (req.query.format == "json") {
        res.status(200).json(tag);
        return;
    }

    let albs = await Album.findAll({
        where: { "$Tags.id$": tag.id },
        include: [Artist, Tag],
        order: [["releaseDate", "ASC"]]
    }); 
    
    res.status(200).render("tag", {tag: tag, albums: await albs});
});

router.post("/", async (req, res) => {
    let tag = Tag.build({
        name: req.body.name
    });

    await tag.save();
    res.status(201).json(tag);
});

router.put("/:id", async (req, res) => {
    let tag = await Tag.findOne({ where: { id: req.params.id }});
    if (tag == null) {
        res.status(404).render("404", {type: "Tag"});
        return;
    }

    if (req.body.name != null) tag.name = req.body.name;

    tag.save();
    res.status(200).json(tag);
});

router.delete("/:id", async (req, res) => {
    let tag = await Tag.findOne({ where: { id: req.params.id }});

    if (tag == null) {
        res.status(404).render("404", {type: "Tag"});
        return;
    }

    tag.destroy();
    res.status(204).send();
});
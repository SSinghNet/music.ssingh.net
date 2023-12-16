import express from "express";
import { Album, Artist, Tag } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";

export let router = express.Router();

router.get("/:id", async (req, res) => {

    let sortBy = "score";
    let sortOrder = "DESC";
    
    if (req.query.sortBy != null) {
        if (req.query.sortBy == "name" || req.query.sortBy == "releaseDate" || req.query.sortBy == "score") {
            sortBy = req.query.sortBy;
            sortOrder = "ASC";
        }
    }

    if (req.query.sortOrder != null) {
        if (req.query.sortOrder == "ASC" || req.query.sortOrder == "DESC") {
            sortOrder = req.query.sortOrder;
        }
    }

    let tag = await Tag.findOne({
        where: { id: req.params.id },
        include: [Album],
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
        where: { "$tags.id$": `${tag.id}` },
        include: [{
            model: Tag,
            where: {
                id: tag.id
            },
        }, Artist],
        // include: [Artist],
        order: [[sortBy, sortOrder]]
    }).catch((err) => {
        return res.status(500).render("404", {type: err});
    });
    
    res.status(200).render("tag", {tag: tag, albums: await albs});
});

router.post("/", restAuth, async (req, res) => {
    let tag = Tag.build({
        name: req.body.name,
        color: req.body.color
    });

    await tag.save();
    res.status(201).json(tag);
});

router.put("/:id", restAuth, async (req, res) => {
    let tag = await Tag.findOne({ where: { id: req.params.id }});
    if (tag == null) {
        res.status(404).render("404", {type: "Tag"});
        return;
    }

    if (req.body.name != null) tag.name = req.body.name;
    if (req.body.color != null) tag.color = req.body.color;

    tag.save();
    res.status(200).json(tag);
});

router.delete("/:id", restAuth, async (req, res) => {
    let tag = await Tag.findOne({ where: { id: req.params.id }});

    if (tag == null) {
        res.status(404).render("404", {type: "Tag"});
        return;
    }

    tag.destroy();
    res.status(204).send();
});
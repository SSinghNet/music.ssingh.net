import express from "express";
import { Album, Artist, Tag } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";
import { PAGE_SIZE, parsePage } from "../utils/pagination.js";

export let router = express.Router();

router.get("/", async (req, res, next) => {
    if (req.query.format != "json") {
        res.status(404).render("404");
        return;
    }
    const count = await Tag.count();
    const getAll = req.query.all === "true";
    const page = parsePage(req.query.page, count);

    let tags = [];

    if (!getAll) {
        tags = await Tag.findAll({
            include: [Album],
            order: [
                ['updatedAt', 'DESC'],
            ],
            limit: PAGE_SIZE + 1,
            offset: page != 0 ? PAGE_SIZE * page : 0
        });
    } else {
        tags = await Tag.findAll({
            include: [Album],
            order: [
                ['updatedAt', 'DESC'],
            ],
        });
    }

    res.status(200).json(tags);
});

router.get("/:id", async (req, res, next) => {

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

    let albs = await Album.findAll({
        where: { "$tags.id$": `${tag.id}` },
        include: [{
            model: Tag,
            where: {
                id: tag.id
            },
        }, Artist],
        order: [[sortBy, sortOrder]]
    }).catch((err) => {
        return res.status(500).render("404", {type: err});
    });

    if (req.query.format == "json") {
        res.status(200).json({...tag.toJSON(), albums: albs});
        return;
    }

    res.status(200).render("tag", {tag: tag, albums: await albs});
});

router.post("/", restAuth, async (req, res, next) => {
    let tag = Tag.build({
        name: req.body.name,
        color: req.body.color
    });

    await tag.save();
    res.status(201).json(tag);
});

router.put("/:id", restAuth, async (req, res, next) => {
    let tag = await Tag.findOne({ where: { id: req.params.id }});
    if (tag == null) {
        res.status(404).render("404", {type: "Tag"});
        return;
    }

    if (req.body.name != null) tag.name = req.body.name;
    if (req.body.color != null) tag.color = req.body.color;

    await tag.save();
    res.status(200).json(tag);
});

router.delete("/:id", restAuth, async (req, res, next) => {
    let tag = await Tag.findOne({ where: { id: req.params.id }});

    if (tag == null) {
        res.status(404).render("404", {type: "Tag"});
        return;
    }

    tag.destroy();
    res.status(204).send();
});
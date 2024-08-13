import express from "express";
import { Album, Artist, Tag } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";

export let router = express.Router();

router.get("/", async (req, res, next) => {
    if (req.query.format != "json") {
        res.status(404).render("404");
        return;
    }
    let page = 0;
    let amount = 21;

    const count = await Tag.count();

    let pageIn = req.query.page;
    let getAll = req.query.all == "true" ? true : false;

    let tags = [];

    if (!getAll) {
        try {
            if (pageIn != null) {
                if (typeof parseInt(pageIn) === "number" && (count / amount) > (pageIn)) {
                    page = parseInt(pageIn);
                }
            }
        } catch {
            console.log("L");
        }

        // page = req.query.page;

        tags = await Tag.findAll({
            include: [Album],
            order: [
                ['updatedAt', 'DESC'],
            ],
            limit: amount + 1,
            offset: page != 0 ? amount * page + 1 : 0
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

    tag.save();
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
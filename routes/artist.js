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
    const count = await Artist.count();
    const getAll = req.query.all === "true";
    const page = parsePage(req.query.page, count);

    const validSortBy = ["name", "updatedAt"];
    const validSortOrder = ["ASC", "DESC"];
    let sortBy = "updatedAt";
    let sortOrder = "DESC";
    if (validSortBy.includes(req.query.sortBy)) sortBy = req.query.sortBy;
    if (validSortOrder.includes(req.query.sortOrder)) sortOrder = req.query.sortOrder;

    let arts = [];

    if (!getAll) {
        arts = await Artist.findAll({
            include: [Album],
            order: [[sortBy, sortOrder]],
            limit: PAGE_SIZE + 1,
            offset: page != 0 ? PAGE_SIZE * page : 0
        });
    } else {
        arts = await Artist.findAll({
            include: [Album],
            order: [[sortBy, sortOrder]],
        });
    }

    res.status(200).json(arts);
});

router.get("/count", async (req, res, next) => {
    const count = await Artist.count();
    res.status(200).json({ count: count, pages: Math.ceil(count / PAGE_SIZE) });
});

router.get("/:id", async (req, res, next) => {
    let sortBy = "releaseDate";
    let sortOrder = "ASC";

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

    let art = await Artist.findOne({
        where: { id: req.params.id },
        include: [Album],
    });

    if (art == null) {
        res.status(404).render("404", { type: "Artist" });
        return;
    }

    let albs2 = await Album.findAll({
        include: [{
            model: Artist,
            where: { id: art.id },
        }],
        order: [[sortBy, sortOrder]],
    }).catch((err) => {
        res.status(500).render("404", { type: err });
        return null;
    });

    if (albs2 == null) return;

    if (req.query.format == "json") {
        res.status(200).json({...art.toJSON(), albums: albs2});
        return;
    }

    res.status(200).render("artist", { artist: art, albums: albs2 });
});

router.post("/", restAuth, async (req, res, next) => {
    let art = Artist.build({
        name: req.body.name,
        image: req.body.image
    });

    await art.save();
    res.status(201).json(art);
});

router.put("/:id", restAuth, async (req, res, next) => {
    let art = await Artist.findOne({ where: { id: req.params.id } });
    if (art == null) {
        res.status(404).render("404", { type: "Artist" });
        return;
    }

    if (req.body.name != null) art.name = req.body.name;
    if (req.body.image != null) art.image = req.body.image;

    await art.save();
    res.status(200).json(art);
});

router.delete("/:id", restAuth, async (req, res, next) => {
    let art = await Artist.findOne({ where: { id: req.params.id } });

    if (art == null) {
        res.status(404).render("404", { type: "Artist" });
        return;
    }

    art.destroy();
    res.status(204).send();
});
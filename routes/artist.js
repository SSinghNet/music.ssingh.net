import express from "express";
import { Album, Artist, Tag } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";
import { Sequelize } from "sequelize";

export let router = express.Router();

router.get("/", async (req, res, next) => {
    if (req.query.format != "json") {
        res.status(404).render("404");
        return;
    }
    let page = 0;
    let amount = 21;

    const count = await Artist.count();

    let pageIn = req.query.page;
    let getAll = req.query.all == "true" ? true : false;

    let arts = [];

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

        arts = await Artist.findAll({
            include: [Album],
            order: [
                ['updatedAt', 'DESC'],
            ],
            limit: amount + 1,
            offset: page != 0 ? amount * page + 1 : 0
        });
    } else {
        arts = await Artist.findAll({
            include: [Album],
            order: [
                ['updatedAt', 'DESC'],
            ],
        });
    }

    res.status(200).json(arts);
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

    if (req.query.format == "json") {
        res.status(200).json(art);
        return;
    }

    let albs = await Album.findAll({
        where: { "$artists.id$": `${art.id}` },
        include: {
            model: Artist,
            having: {
                id: art.id
            },
            include: [
                {
                    model: Album,
                    include: [{ model: Artist }],
                },
            ],
        },
        order: [[Sequelize.literal("`artists->albums` ."), sortBy, sortOrder]],
        subQuery: false,
    }).catch((err) => {
        return res.status(500).render("404", { type: err });
    });

    // console.log(await albs[0]["dataValues"].artists[0]["dataValues"].albums);
    // console.log(albs);
    let albs2 = albs[0]["dataValues"].artists[0]["dataValues"].albums;

    // let albs = await Album.findAll({ where: { "$Artists.id$": art.id }, include: [Artist] });
    // console.log(albs[0].artists)

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

    art.save();
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
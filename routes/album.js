import express from "express";
import sanitizeHtml from 'sanitize-html';
import { Album, Artist, Tag } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";
import { PAGE_SIZE, parsePage } from "../utils/pagination.js";

import * as discord from "../controllers/discord.js";

import { __dirname } from "../app.js";
import nodeHtmlToImage from 'node-html-to-image'

export let router = express.Router();

router.get("/", async (req, res, next) => {
    if (req.query.format != "json") {
        res.status(404).render("404");
        return;
    }
    const count = await Album.count();
    const getAll = req.query.all === "true";
    const page = parsePage(req.query.page, count);

    let albs = [];

    if (!getAll) {
        albs = await Album.findAll({
            include: [Artist, Tag],
            order: [
                ['updatedAt', 'DESC'],
            ],
            limit: PAGE_SIZE + 1,
            offset: page != 0 ? PAGE_SIZE * page : 0
        });
    } else {
        albs = await Album.findAll({
            include: [Artist, Tag],
            order: [
                ['updatedAt', 'DESC'],
            ],
        });
    }

    res.status(200).json(albs);
});

router.get("/count", async (req, res, next) => {
    const count = await Album.count();
    res.status(200).json({count: count, pages: Math.ceil(count/PAGE_SIZE)});
});

/**
 * @param id 
 * @param format accepts json (defaults to default)
 */
router.get("/:id", async (req, res, next) => {
    let alb = await Album.findOne({ where: { id: req.params.id }, include: [Artist, Tag] });

    if (alb == null) {
        res.status(404).render("404", { type: "Album" });
        return;
    }

    if (req.query.format == "json") {
        res.status(200).json(alb);
        return;
    }

    let desc = sanitizeHtml(alb.review, {
        allowedTags: [],
        allowedAttributes: []
    });
    
    alb.review = sanitizeHtml(alb.review);
    
    res.status(200).render("album", { title: `${alb.name} - `, album: alb, descCleansed: desc });
});

/**
 * @param name album name
 * @param artists array of album artists [id, name, image] (artid = -1 when newArtist)
 * @param image album image (optional)
 * @param releaseDate album release date (optional)
 * @param score album score (optional)
 * @param review album review (optional)
 * @param tags array of album tags (optional) [id, name] (tagid = -1 when newTag)
 */
router.post("/", restAuth, async (req, res, next) => {
    let alb = Album.build({
        name: req.body.name,
        image: req.body.image,
        releaseDate: req.body.releaseDate,
        score: req.body.score,
        review: req.body.review,
    }, {
        include: [Artist, Tag]
    });

    await alb.save();

    if (req.body.artists != null) {
        for (const artist of req.body.artists) {
            if (artist["id"] == -1 || artist["id"] == null) {
                const result = await Artist.findOne({ where: { name: artist["name"] } });
                if (result != null) {
                    await alb.addArtist(result);
                } else {
                    const art = await Artist.create({ name: artist["name"], image: artist["image"] });
                    await alb.addArtist(art);
                }
            } else {
                const found = await Artist.findOne({ where: { id: artist["id"] } });
                await alb.addArtist(found);
            }
        }
    }

    if (req.body.tags != null) {
        for (const tag of req.body.tags) {
            if (tag["id"] == -1 || tag["id"] == null) {
                const result = await Tag.findOne({ where: { name: tag["name"] } });
                if (result != null) {
                    await alb.addTag(result);
                } else {
                    const ta = await Tag.create({ name: tag["name"] });
                    await alb.addTag(ta);
                }
            } else {
                const found = await Tag.findOne({ where: { id: tag["id"] } });
                await alb.addTag(found);
            }
        }
    }

    discord.sendEmbed(alb);

    res.status(201).json(alb);
});

/**
 * @param id
 * @param name album name
 * @param artists array of album artists [id, name, image] (artid = -1 when newArtist)
 * @param image album image (optional)
 * @param releaseDate album release date (optional)
 * @param score album score (optional)
 * @param review album review (optional)
 * @param tags array of album tags (optional) [id, name] (tagid = -1 when newTag)
 */
router.put("/:id", restAuth, async (req, res, next) => {
    let alb = await Album.findOne({ where: { id: req.params.id }, include: [Artist, Tag] });
    if (alb == null) {
        res.status(404).render("404", { type: "Album" });
        return;
    }

    if (req.body.name != null) alb.name = req.body.name;
    if (req.body.image != null) alb.image = req.body.image;
    if (req.body.releaseDate != null) alb.releaseDate = req.body.releaseDate;
    if (req.body.score != null) alb.score = req.body.score;
    if (req.body.review != null) alb.review = req.body.review;

    if (req.body.artists != null) {
        for (const artist of alb.artists) {
            await alb.removeArtist(artist);
        }

        for (const artist of req.body.artists) {
            if (artist["id"] == -1 || artist["id"] == null) {
                const result = await Artist.findOne({ where: { name: artist["name"] } });
                if (result != null) {
                    await alb.addArtist(result);
                } else {
                    const art = await Artist.create({ name: artist["name"], image: artist["image"] });
                    await alb.addArtist(art);
                }
            } else {
                const found = await Artist.findOne({ where: { id: artist["id"] } });
                await alb.addArtist(found);
            }
        }
    }

    if (req.body.tags != null) {
        for (const tag of alb.tags) {
            await alb.removeTag(tag);
        }

        for (const tag of req.body.tags) {
            if (tag["id"] == -1 || tag["id"] == null) {
                const result = await Tag.findOne({ where: { name: tag["name"] } });
                if (result != null) {
                    await alb.addTag(result);
                } else {
                    const ta = await Tag.create({ name: tag["name"] });
                    await alb.addTag(ta);
                }
            } else {
                const found = await Tag.findOne({ where: { id: tag["id"] } });
                await alb.addTag(found);
            }
        }
    }

    await alb.save();
    res.status(200).json(alb);
});

router.delete("/:id", restAuth, async (req, res, next) => {
    let alb = await Album.findOne({ where: { id: req.params.id }, include: [Artist, Tag] });

    if (alb == null) {
        res.status(404).render("404", { type: "Album" });
        return;
    }

    alb.destroy();
    res.status(204).send();
});

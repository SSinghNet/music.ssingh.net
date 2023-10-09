import express from "express";
import { Album, Artist, Tag } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";

export let router = express.Router();

/**
 * @param id 
 * @param format accepts json (defaults to default)
 */
router.get("/:id", async (req, res) => {
    let alb = await Album.findOne({ where: { id: req.params.id }, include: [Artist, Tag]});

    if (alb == null) {
        res.status(404).render("404", {type: "Album"});
        return;
    }

    if (req.query.format == "json") {
        res.status(200).json(alb);
        return;
    }
    
    res.status(200).render("album", {title: `${alb.name} - ` , album: alb});
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
router.post("/", restAuth, async (req, res) => {
    let alb = Album.build({ 
        name: req.body.name,
        image: req.body.image,
        releaseDate: req.body.releaseDate,
        score: req.body.score,
        review: req.body.review,
    }, { 
        include: [Artist, Tag]
    });

    if (req.body.artists != null) {
        req.body.artists.forEach(async (artist) => {
            if (artist["id"] == -1 || artist["id"] == null) {
                Artist.findOne({ where: { name: artist["name"] } }).then(async (result) => {
                    if (result != null) {
                        alb.addArtist(await Artist.findOne({ where: { id: result.id } }));
                    } else {
                        let art = await Artist.create({ name: artist["name"], image: artist["image"] });
                        alb.addArtist(await Artist.findOne({ where: { id: await art.id } }));
                    }
                });
            } else {
                alb.addArtist(await Artist.findOne({ where: { id: artist["id"] } }));
            }
        });
    }

    if (req.body.tags != null) {
        req.body.tags.forEach(async (tag) => {
            console.log(tag);
            if (tag["id"] == -1 || tag["id"] == null) {
                Tag.findOne({ where: { name: tag["name"] } }).then(async (result) => {
                    if (result != null) {
                        alb.addTag(await Tag.findOne({ where: { id: result.id } }));
                    } else {
                        let ta = await Tag.create({ name: tag["name"] });
                        alb.addTag(await Tag.findOne({ where: { id: await ta.id } }));
                    }
                });
            } else {
                alb.addTag(await Tag.findOne({ where: { id: tag["id"] } }));
            }
        });
    }

    await alb.save();
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
router.put("/:id", restAuth, async (req, res) => {
    let alb = await Album.findOne({ where: { id: req.params.id }, include: [Artist, Tag] });
    if (alb == null) {
        res.status(404).render("404", {type: "Album"});
        return;
    }
 
    if (req.body.name != null) alb.name = req.body.name;
    if (req.body.image != null) alb.image = req.body.image;
    if (req.body.releaseDate != null) alb.releaseDate = req.body.releaseDate;
    if (req.body.score != null) alb.score = req.body.score;
    if (req.body.review != null) alb.review = req.body.review;

    if (req.body.artists != null) {
        alb.artists.forEach(async (artist) => {
            alb.removeArtist(artist);
        });

        req.body.artists.forEach(async (artist) => {
            if (artist["id"] == -1 || artist["id"] == null) {
                Artist.findOne({ where: { name: artist["name"] } }).then(async (result) => {
                    if (result != null) {
                        alb.addArtist(await Artist.findOne({ where: { id: result.id } }));
                    } else {
                        let art = await Artist.create({ name: artist["name"], image: artist["image"] });
                        alb.addArtist(await Artist.findOne({ where: { id: await art.id } }));
                    }
                });
            } else {
                alb.addArtist(await Artist.findOne({ where: { id: artist["id"] } }));
            }
        });
    }

    if (req.body.tags != null) {
        alb.tags.forEach(async (tag) => {
            alb.removeTag(tag);
        });

        req.body.tags.forEach(async (tag) => {
            console.log(tag);
            if (tag["id"] == -1 || tag["id"] == null) {
                Tag.findOne({ where: { name: tag["name"] } }).then(async (result) => {
                    if (result != null) {
                        alb.addTag(await Tag.findOne({ where: { id: result.id } }));
                    } else {
                        let ta = await Tag.create({ name: tag["name"] });
                        alb.addTag(await Tag.findOne({ where: { id: await ta.id } }));
                    }
                });
            } else {
                alb.addTag(await Tag.findOne({ where: { id: tag["id"] } }));
            }
        });
    }

    alb.save();
    res.status(200).json(alb);
});

router.delete("/:id", restAuth, async (req, res) => {
    let alb = await Album.findOne({ where: { id: req.params.id }, include: [Artist, Tag]});

    if (alb == null) {
        res.status(404).render("404", {type: "Album"});
        return;
    }

    alb.destroy();
    res.status(204).send();
});
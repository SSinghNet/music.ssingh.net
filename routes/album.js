import express from "express";
import sanitizeHtml from 'sanitize-html';
import { Album, Artist, Tag } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";

import * as discord from "../controllers/discord.js";

import { __dirname } from "../app.js";
import nodeHtmlToImage from 'node-html-to-image'

export let router = express.Router();

router.get("/", async (req, res, next) => {
    if (req.query.format != "json") {
        res.status(404).render("404");
        return;
    }
    let page = 0;
    let amount = 21;

    const count = await Album.count();

    let pageIn = req.query.page;
    let getAll = req.query.all == "true" ? true : false;

    let albs = [];

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

        albs = await Album.findAll({
            include: [Artist, Tag],
            order: [
                ['updatedAt', 'DESC'],
            ],
            limit: amount + 1,
            offset: page != 0 ? amount * page + 1 : 0
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
    res.status(200).json({count: count, pages: Math.ceil(count/21)});
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

    // getAlbumCardImage(alb.id).then(()=> {
    //     discord.sendMessage({
    //         content: `https://music.ssingh.net/album/${alb.id}`, 
    //         files: [__dirname + "/public/images/albumimage.png"]
    //     });
    // });
    
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

    if (req.body.artists != null) {
        req.body.artists.forEach(async (artist) => {
            console.log(artist["name"]);
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

    // alb.save().then(() => {
    //     getAlbumCardImage(alb.id).then(()=> {
    //         discord.sendMessage({
    //             content: `https://music.ssingh.net/album/${alb.id}`, 
    //             files: [__dirname + "/public/images/albumimage.png"]
    //         });
    //     });
    // });

    alb.save().then(() => {
        discord.sendMessage({
        content: `${alb.name} | https://music.ssingh.net/album/${alb.id}`
        })
    });
    
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

router.delete("/:id", restAuth, async (req, res, next) => {
    let alb = await Album.findOne({ where: { id: req.params.id }, include: [Artist, Tag] });

    if (alb == null) {
        res.status(404).render("404", { type: "Album" });
        return;
    }

    alb.destroy();
    res.status(204).send();
});

const getAlbumCardImage = async (id) => {
    let alb = await Album.findOne({ where: { id: id }, include: [Artist, Tag] });

    if (alb == null) {
        res.status(404).render("404", { type: "Album" });
        return;
    }

    const chipHtml = (content, small) => {
        let size = "font-size: 1rem; line-height: 1.5rem;";
        if (small) {
            size = "font-size: 0.75rem; line-height: 1rem;"
        }

        return `<div style='${size} display: flex; background-color:#181A1C; color:#e5e6e4; padding: 1.5px; border-radius:1.5rem; padding:.375rem; padding-left: .5rem; padding-right:.5rem; margin:.25rem; width:fit-content;' ><span style='margin:auto; margin-left:.5rem; margin-right:.5rem;text-wrap: nowrap;text-overflow: ellipsis;'>${content}</span></div>`;
    }

    const artHtml = alb.artists.map((art) => {
        return chipHtml(art.name, false);
    });

    const tagHtml = alb.tags.map((tag) => {
        return chipHtml(tag.name, true);
    });

    return nodeHtmlToImage({
        output: "./public/images/albumimage.png",
        html: "<html>" +
                "<head>" + 
                    "<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Didact%20Gothic'>" + 
                    "<style> body {background-color: #393c3f; width:1100px; height: 500px; font-family: 'Didact Gothic', system-ui; font-weight: 400; font-style: normal; display:flex;  } </style>" +
                "</head>" +
                "<body>" +
                    "<div style='padding:15px; display:flex; padding-bottom: 50px; width:100%;' ><div style='background-color:#e5e6e4; border-radius:1.5rem; min-height:400px; max-height:400px; overflow:hidden; margin:auto; display:flex;flex-direction:column; justify-content: space-evenly; padding:15px; width: 100%;'>" + 
                        "<div style='display:flex;flex-direction:row;justify-content: space-between;'>" + 
                            `<img src='${alb.image}' style='width:220px; height:220px; margin: auto;--tw-shadow: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1); --tw-shadow-colored: 0 20px 25px -5px black, 0 8px 10px -6px black; box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);'/>` +
                            "<div style='display:flex;flex-direction:column; text-align:center; justify-content:center; margin: auto;'>" + 
                                `<h1>${alb.name}</h1>` +
                                `<div style='display:flex; margin:auto;'>${artHtml.join("")}</div>` +
                                `<h4 style='font-weight:500;'>${alb.releaseDate}</h4>` +
                                `<div style='display:flex; margin:auto;'>${tagHtml.join("")}</div>` +
                            "</div>" +
                            `<div style='margin:auto; border: 2px solid #F2545B; padding:1.5rem;  aspect-ratio:1/1; border-radius: 100%; height:4rem; width: 4rem;display:flex;'><h1 style='margin:auto; '>${alb.score}%</h1></div>` +
                        "</div>" +
                        "<hr style='border: 1px #00000025 solid; width:90%'>" +
                        `<center style=""><p>${alb.review}</p></center>` +
                    "</div></div>" +
                    "<div style='position:absolute; background-color: #181A1C; color:#e5e6e4; font-size: 1rem; bottom:90; width:1100px; margin:0; padding: 10px; display:flex; flex-direction:row; justify-content: space-between;' >" +
                        `<div style='font-size:1.25rem; color: #F2545B; margin-top:auto; margin-bottom:auto; display:flex;'><img src='https://music-ssingh.onrender.com/images/slogo.png' width='30'><span style='margin:auto; margin-left: 5px;'>Music</span></div>` +
                        `<div style='margin-top:auto; margin-bottom:auto; margin-right: 30px;font-size: 0.8rem;'>https://music.ssingh.net/album/${alb.id}</div>` + 
                    "</div>" +
                "</body>" +
            "</html>",
    });   
};
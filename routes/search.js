import express from "express";
import { Sequelize } from "sequelize";
import { Album, Artist, Tag } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res, next) => {
    const query = req.query.query;
    let noResults = false;
    let results = null;
    if (query == null || query == "") {
        noResults = true;
    } else {
        results = { albums: {}, artists: {}, tags: {} };
        results.albums = await Album.findAll({
            where: {
                [Sequelize.Op.or]: [{
                    name: {
                        [Sequelize.Op.like]: `%${req.query.query}%`
                    }
                }, {
                    "$artists.name$": {
                        [Sequelize.Op.like]: `%${req.query.query}%`
                    },
                },{
                    "$tags.name$": {
                        [Sequelize.Op.like]: `%${req.query.query}%`
                    },
                }]
            },
            include: [Artist, Tag]
        });

        results.artists = await Artist.findAll({ where: { name: {[Sequelize.Op.like]: `%${req.query.query}%` } } });
        results.tags = await Tag.findAll({ where: { name: {[Sequelize.Op.like]: `%${req.query.query}%` } } });
        // console.log(results);
    }
    res.render("search", {title:"Search - ", noResults:noResults, results: results, query: req.query.query});
});

router.get("/album", async (req, res, next) => {
    res.json(await Album.findAll({ where: { name: req.query.name } }));
    // return Album.findAll({ where: { name: req.query.name } });
}); 

router.get("/artist", async (req, res, next) => {
    res.json(await Artist.findAll({ where: { name: req.query.name } }));
});

router.get("/tag", async (req, res, next) => {
    res.json(await Tag.findAll({ where: { name: req.query.name } }));
});
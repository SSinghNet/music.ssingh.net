import express from "express";
import { Sequelize } from "sequelize";
import { Album, Artist, Tag } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res) => {
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
                    "$Artists.name$": {
                        [Sequelize.Op.like]: `%${req.query.query}%`
                    },
                },{
                    "$Tags.name$": {
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

router.get("/album", async (req, res) => {
    //TODO: make it so it checks the params and searchs based on availiable params
    res.json(await Album.findAll({ where: { name: req.query.name } }));
    // return Album.findAll({ where: { name: req.query.name } });
}); 

router.get("/artist", async (req, res) => {
    res.json(await Artist.findAll({ where: { name: req.query.name } }));
});

router.get("/tag", async (req, res) => {
    res.json(await Tag.findAll({ where: { name: req.query.name } }));
});
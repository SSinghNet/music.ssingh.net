import express from "express";
import { Album, Artist, Tag } from "../models/models.js";

export let router = express.Router();

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
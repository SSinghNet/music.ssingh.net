import express from "express";
import { Album, Artist, Tag } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res, next) => { 
    
    let albums = await Album.findAll({ include: [Artist, Tag]});
    let artists = await Artist.findAll({ include: Album });
    let tags = await Tag.findAll({ include: Album });
    
    res.render("database", {title: "database", albums: albums, artists: artists, tags: tags})

});
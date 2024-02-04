import express from "express";
import { Album, Artist, Tag, List } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";

export let router = express.Router();

router.get("/", async (req, res) => {
    let items;
    let type = req.query.type;
    if (type != "albums" && type != "artists" && type != "tags" && type != "lists") {
        type = "albums";
    }

    switch (type) {
        default:
            items = await Album.findAll({
                include: [Artist, Tag], order: [
                    ['updatedAt', 'DESC'],
                ]
            });
            break;
        case "artists":
            items = await Artist.findAll({
                include: [Album], order: [
                    ['updatedAt', 'DESC'],
                ]
            });
            break;
        case "tags":
            items = await Tag.findAll({
                include: [Album], order: [
                    ['updatedAt', 'DESC'],
                ]
            });
            break;
        case "lists":
            items = await List.findAll({
                include: [Album], order: [
                    ['updatedAt', 'DESC'],
                ]
            });
            break;
    }
    
    res.render("admin", {title: "Admin - ", items: items});
});

router.get("/login", async (req, res) => {
    req.query.returnUrl;    
    res.render("login");
});

import express from "express";
import { Album, Artist, Tag, List } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";
import { Sequelize } from "sequelize";

export let router = express.Router();

router.get("/", async (req, res, next) => {
    let lists = await List.findAll({
        include: [Album]
    });

    if (req.query.format == "json") {
        res.status(200).json(lists);
        return;
    }

    res.render("lists", {title: "Lists - ", lists: lists});
});

router.get("/:id", async (req, res, next) => {
    let list = await List.findOne({
        where: {
            id: req.params.id
        }, include: [{
            model: Album,
            include: [{ model: Artist }],
        }], 
    });

    if (list == null) {
        res.status(404).render("404", {type: "List"});
        return;
    }

    if (req.query.format == "json") {
        res.status(200).json(list);
        return;
    }
    
    res.status(200).render("list", {title: `${list.name} - ` , list: list});
});

router.post("/", restAuth, async (req, res, next) => {
    let myList = List.build({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
    }, {
        include: [Album]
    });

    await myList.save();
    if (req.body.albums != null) {
        (req.body.albums).forEach(async (album) => {
            if (album["id"] == -1 || album["id"] == null) {
                Album.findOne({ where: { name: album["name"] } }).then(async (result) => {
                    if (result != null) {
                        myList.addAlbum(await Album.findOne({ where: { id: result.id } }));
                    }
                });
            } else {
                myList.addAlbum(await Album.findOne({ where: { id: album["id"] } }));
            }
        });
    }
    await myList.save();
    res.status(201).json(myList);
});

router.put("/:id", restAuth, async (req, res, next) => {
    let list = await List.findOne({ where: { id: req.params.id }, include: [Album] });
    if (list == null) {
        res.status(404).render("404", {type: "List"});
        return;
    }
    if (req.body.name != null) list.name = req.body.name;
    if (req.body.description != null) list.description = req.body.releaseDate;
    if (req.body.image != null) list.image = req.body.image;

    await list.save();
    if (req.body.albums != null) {
        (req.body.albums).forEach(async (album) => {
            if (album["id"] == -1 || album["id"] == null) {
                Album.findOne({ where: { name: album["name"] } }).then(async (result) => {
                    if (result != null) {
                        list.addAlbum(await Album.findOne({ where: { id: result.id } }));
                    }
                });
            } else {
                list.addAlbum(await Album.findOne({ where: { id: album["id"] } }));
            }
        });
    }

    await list.save();
    res.status(201).json(list);
});

router.delete("/:id", restAuth, async (req, res, next) => {
    let list = await List.findOne({ where: { id: req.params.id } });

    if (list == null) {
        res.status(404).render("404", {type: "List"});
        return;
    }

    list.destroy();
    res.status(204).send();
});


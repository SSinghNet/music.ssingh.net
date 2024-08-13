import express from "express";
import { Album, Artist, Tag } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res, next) => {
    let page = 0;
    let amount = 21;

    const count = await Album.count().catch((err) => next(err));

    let pageIn = req.query.page;

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

    let albs = await Album.findAll({
        include: [Artist, Tag],
        order: [
            ['updatedAt', 'DESC'],
        ],
        limit: amount + 1,
        offset: page != 0 ? amount * page + 1: 0
    });

    res.render("index", { title: "Home - ", albums: albs, page: page, maxPage: count / amount });
});

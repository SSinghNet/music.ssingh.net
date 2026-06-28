import express from "express";
import { Album, Artist, Tag } from "../models/models.js";
import { PAGE_SIZE, parsePage } from "../utils/pagination.js";

export let router = express.Router();

router.get("/", async (req, res, next) => {
    const count = await Album.count().catch((err) => next(err));
    const page = parsePage(req.query.page, count);

    let albs = await Album.findAll({
        include: [Artist, Tag],
        order: [
            ['updatedAt', 'DESC'],
        ],
        limit: PAGE_SIZE + 1,
        offset: page != 0 ? PAGE_SIZE * page : 0
    });

    res.render("index", { title: "Home - ", albums: albs, page: page, maxPage: count / PAGE_SIZE });
});

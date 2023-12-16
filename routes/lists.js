import express from "express";
import { Album, Artist, Tag } from "../models/models.js";
import { restAuth } from "../middleware/restAuth.js";
import { Sequelize } from "sequelize";

export let router = express.Router();

router.get("/", async (req, res) => {
    res.render("lists", {title: "Lists - "});
});

router.get("/:id", async (req, res) => {
    //TODO
});

router.post("/:id", async (req, res) => {
    //TODO
});

router.put("/:id", async (req, res) => {
    //TODO
});

router.delete("/:id", async (req, res) => {
    //TODO
});


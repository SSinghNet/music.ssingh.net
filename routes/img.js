import express from "express";
import AWS from "aws-sdk";
import { restAuth } from "../middleware/restAuth.js";
import memoryCache from "memory-cache";
import { __dirname } from "../app.js";

export let router = express.Router();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const Bucket = process.env.BUCKET;

const s3 = new AWS.S3({
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    region
});

router.get("/", async (req, res, next) => {
    if (req.query.key == null) {
        res.send("no key provided");
        return;
    }

    res.header('Cache-Control', 'max-age=120');
    res.set('Content-type', "image/webp");

    let cachedImage = memoryCache.get("img" + req.query.key);
    if (cachedImage) {
        return res.send(cachedImage);
    }

    try {
        let s3File = await s3.getObject({
            Bucket: Bucket,
            Key: req.query.key,
        }).promise();
        memoryCache.put("img" + req.query.key, s3File.Body, 5 * 60 * 1000);
        res.send(s3File.Body);
    } catch (error) {
        res.set('Content-type', "image/png");
        res.sendFile(__dirname + "/public/images/no_image.png");
    }
});

router.post("/", restAuth, async (req, res, next) => {
    const url = encodeURI(req.body.url);
    const key = req.body.key;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            res.status(502).send(`Failed to fetch image: ${response.status}`);
            return;
        }
        const body = Buffer.from(await response.arrayBuffer());

        await s3.putObject({ Bucket: process.env.BUCKET, Key: key, Body: body }).promise();
        res.send("Success: " + key);
    } catch (err) {
        console.error("Image upload error:", err);
        res.status(500).send(err.message);
    }
});

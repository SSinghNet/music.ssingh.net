import express from "express";
import AWS from "aws-sdk";
import request from "request";
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
    let url = encodeURI(req.body.url);
    let key = req.body.key;

    let options = {
        method: 'GET',
        url: url,
        encoding: null
    };
    let body2 = "";
    request(options, (error, response) => {
        if (error) {
            throw new Error(error)
        }

        body2 = response.body;

        const params = {
            Bucket: process.env.BUCKET,
            Key: key,
            Body: body2,
        };

        s3.putObject(params, async (err, data) => {
            if (err) {
                console.log("Error: ", err);
                res.send(err);
            } else {
                res.send("Success: " + key);
            }
        });
    });
});

import express from "express";
import AWS from "aws-sdk";
import request from "request";
import { restAuth } from "../middleware/restAuth.js";

export let router = express.Router();

const s3 = new AWS.S3();

router.get("/", async (req, res) => {
    let s3File = await s3.getObject({
        Bucket: process.env.BUCKET,
        Key: req.query.key,
    }).promise();

    res.set('Content-type', "image/webp");
    res.send(s3File.Body);
});

router.post("/", restAuth, async (req, res) => {
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
                res.send("Success: " +  key);
            }
        });
    });
});

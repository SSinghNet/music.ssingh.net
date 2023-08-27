import express from "express";
import { Album, Artist, Tag } from "../models/models.js";

export let router = express.Router();

router.get("/", async (req, res) => {
    // const createTest = async () => {
    //     return await Album.create({
    //         name: "Scaring The Hoes",
    //         image: "https://townsquare.media/site/838/files/2023/03/attachment-danny-brown-jpegmafia-scaringthehoes.jpeg?w=980&q=75",
    //         artists: [{
    //             name: "JPEGMAFIA",
    //             image: "https://i.guim.co.uk/img/media/6bbbc9f89a8774cab39de8150e0d12807b56fc04/0_150_4978_2986/master/4978.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=386a8793d76c8b34bcb3bd04b5dc87ec"
    //         },{
    //             name: "Danny Brown",
    //             image: "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcSj8b3ykKyqb5ri-yt1VxH4I2-BVULVzNC-zarBG6_1fNDcOBLrbmrgd-ulcVovJwRCZ5s09OzE08_hFQ6o0ucFFRST3ddF3yXI07cTuP2F"
    //         }],
    //         tags: [{name: "alt hip hop"}, {name: "experimental hip hop"}]
    //     }, {
    //         include: [Artist, Tag]
    //     }
    //     );
    // };

    // let test = await createTest();

    // console.log(await Artist.findOne({ where: { name: "JPEGMAFIA" } }));

    // Album.create({ 
    //     name: "LP!",
    //     image: "https://media.pitchfork.com/photos/6172b22d2264f526b6262816/1:1/w_600/Jpegmafia-LP.jpg",
    //     artists: [await Artist.findOne({where: {name: "JPEGMAFIA"}})],
    //     tags: [await Tag.findOne({where: {name: "experimental hip hop"}}), {name: "hardcore hip hop"}],
    // }, {
    //     include: [Artist, Tag]
    // });

    // let test = await Album.create({
    //     name: "LP!",
    //     image: "https://media.pitchfork.com/photos/6172b22d2264f526b6262816/1:1/w_600/Jpegmafia-LP.jpg",
    // }, {
    //     include: [Artist, Tag]
    // });

    // test.addArtist(await Artist.findOne({ where: { name: "JPEGMAFIA" } }));
    // test.addTag(await Tag.findOne({ where: { name: "experimental hip hop" } }));
    // test.addTag({name: "hardcore hip hop"});


    // let testAl = Album.build({
    //     name: "LP!",
    //     image: "https://media.pitchfork.com/photos/6172b22d2264f526b6262816/1:1/w_600/Jpegmafia-LP.jpg",
    //     artists: [],
    //     tags: [{name: "hardcore hip hop"}],
    // }, {
    //     include: [Artist, Tag]
    // });

    // testAl.artists = await Artist.findOne({ where: { name: "JPEGMAFIA" } });


    res.render("index", { title: "Music.SSingh.Net" });
});

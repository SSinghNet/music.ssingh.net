import jwt from "jsonwebtoken";
import "dotenv/config";

export const restAuth = (req, res, next) => {
    console.log("auth");
    let auth = false;
    
    jwt.verify(req.get("token"), process.env.SECRET, (err, user) => {
        if (err || user.user != "root") {
            return res.sendStatus(403);
        }
        console.log(user);
        next();
    });

};

export const getAccessToken = (user) => {
    return jwt.sign({ user: user }, process.env.SECRET);
}
import jwt from "jsonwebtoken";
import "dotenv/config";

export const restAuth = (req, res, next) => {
    if (process.env.NODE_ENV == "production") {
        console.log("auth");
        let auth = false;
        
        jwt.verify(req.get("token"), process.env.SECRET, (err, user) => {
            if (err || user.user != "root") {
                return res.sendStatus(403);
            }
            console.log(user);
            next();
        });
    } else {
        next();
    }
};

export const getAccessToken = (user) => {
    return jwt.sign({ user: user }, process.env.SECRET);
}
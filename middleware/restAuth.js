import { jwtVerify, SignJWT } from "jose";
import "dotenv/config";

const secret = () => new TextEncoder().encode(process.env.SECRET);

export const restAuth = async (req, res, next) => {
    if (process.env.NODE_ENV == "production") {
        try {
            const { payload } = await jwtVerify(req.get("token"), secret());
            if (payload.user != "root") {
                return res.sendStatus(403);
            }
            next();
        } catch {
            return res.sendStatus(403);
        }
    } else {
        next();
    }
};

export const getAccessToken = async (user) => {
    return await new SignJWT({ user })
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret());
};

import { verifyAccessToken } from "../utils/token.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function authenticationMiddleware(req, res, next) {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) return next();

    if (!authorizationHeader.startsWith("Bearer")) {
        return res.status(401).json({ error: "You are not authorized to access this resource" });
    }
    
    const [_, token] = authorizationHeader.split(" ");
    const user = verifyAccessToken(token);
    if (!user) {
        return res.status(401).json({ error: "You are not authorized to access this resource" });
    }
    req.user = user;
    next();
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
*/
export function ensureUserIsAuthenticated(req, res, next) {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "You are not authorized to access this resource" });
    }
    next();
}
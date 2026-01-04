import "dotenv/config";
import jwt from "jsonwebtoken";

export const createAccessToken = (user) => {
    const { firstName, lastName, id } = user;
    return jwt.sign(
        { firstName, lastName, id },
        process.env.JWT_SECRET,
        { expiresIn: "7Min" });
};

export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};

export const getRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" });
};

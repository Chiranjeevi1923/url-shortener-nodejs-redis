import db from "../db/index.js";
import { urlTable } from "../models/url.model.js";
import { eq } from "drizzle-orm";

export const insertShortUrl = async (urlData) => {
    try {
        const { url, code, userId } = urlData;
        const shortCode = code ?? nanoid(7);

        const [newUrl] = await db.insert(urlTable)
            .values({
                shortCode,
                targetUrl: url,
                userId
            })
            .returning({
                id: urlTable.id,
                shortCode: urlTable.shortCode,
                targetUrl: urlTable.targetUrl
            });

        return newUrl;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getUrlByShortCode = async (shortCode) => {
    try {
        const [url] = await db.select()
            .from(urlTable)
            .where(eq(urlTable.shortCode, shortCode))
            .limit(1);

        return url;
    } catch (error) {
        throw new Error(error.message);
    }
}

import { z } from 'zod';
import { nanoid } from 'nanoid';
import { urlPostRequestBodySchema } from '../validations/request.validation.js';
import { getUrlByShortCode, insertShortUrl } from '../services/url.service.js';
import { redisClient } from "../cache/redisClient.js";
import { REDIS_URL_CLICK_COUNT_PREFIX, REDIS_URL_PREFIX } from '../constants/redis.constants.js';
import { urlTable } from '../models/url.model.js';
import { eq, sql } from 'drizzle-orm';
import db from '../db/index.js';

export const createShortUrl = async (req, res) => {
    const validationResult = await urlPostRequestBodySchema.safeParseAsync(req.body);

    if (validationResult.error) {
        return res.status(400).json({
            error: z.treeifyError(validationResult.error)
        });
    }
    try {
        const { url, code } = validationResult.data;
        const shortCode = code ?? nanoid(7);

        const newUrl = await insertShortUrl({
            url,
            code: shortCode,
            userId: req.user.id
        });

        res.status(201).json({
            message: 'Short URL created successfully',
            data: newUrl
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

export const redirectShortUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) return res.status(400).json({ error: "Short code is required" });

        redisClient.incr(`${REDIS_URL_CLICK_COUNT_PREFIX}${shortCode}`);

        const cachedUrl = await redisClient.get(`${REDIS_URL_PREFIX}${shortCode}`);


        if (cachedUrl) {
            return res.redirect(cachedUrl);
        }

        const urlData = await getUrlByShortCode(shortCode);
        if (!urlData) return res.status(404).json({ error: "URL not found" });

        await redisClient.set(`${REDIS_URL_PREFIX}${shortCode}`, urlData.targetUrl, 'EX', 60 * 60 * 24); // Cache for 1 day

        res.redirect(urlData.targetUrl);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

export const syncClickCounts = async (req, res) => {
    try {
        const keys = await redisClient.keys(`${REDIS_URL_CLICK_COUNT_PREFIX}*`);

        for (const key of keys) {
            const shortCode = key.split(":")[1];
            const clickCount = parseInt(await redisClient.get(key), 10);
            // console.log(`Key: ${key}, Click Count: ${clickCount}`);

            if(clickCount > 0) {
                await db.update(urlTable)
                .set({
                    clickCount: sql`${urlTable.clickCount} + ${clickCount}`
                })
                .where(eq(urlTable.shortCode, shortCode));

                await redisClient.del(key);
            }
        }

        res.status(200).json({
            message: 'Click counts synchronized successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}
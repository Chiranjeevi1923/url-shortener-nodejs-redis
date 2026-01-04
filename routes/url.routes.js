import express from 'express';
import { createShortUrl, redirectShortUrl, syncClickCounts } from '../controllers/url.controller.js';
import { ensureUserIsAuthenticated } from '../middlewares/auth.middleware.js';
import { rateLimiter } from '../middlewares/rateLimitter.middleware.js';

const router = express.Router();
router.use(express.json());


router.post('/shorten', ensureUserIsAuthenticated, createShortUrl);
router.patch('/syncClickCounts', ensureUserIsAuthenticated, syncClickCounts);
router.get('/:shortCode', rateLimiter, redirectShortUrl);

export default router;
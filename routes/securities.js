'use strict';
import { Router } from 'express';
import { hasSecurity } from '../middleware/auth.js';
import { Securities } from '../models/securities.js';

const router = new Router();

router.get('/', hasSecurity(Securities.TYPE.admin), async (req, res) => {
    res.json(await Securities.getDescriptions());
});

export default router;
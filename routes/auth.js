'use strict';
import { Router } from 'express';
import passport from 'passport';
import { isAuthed } from '../middleware/auth.js';

const router = new Router();

router.get('/google/callback', passport.authenticate('google'), async (req, res) => {
    res.status(200).json(await req.user.toDTO(true));
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.post('/local', passport.authenticate('local'), async (req, res) => {
    res.status(200).json(await req.user.toDTO(true));
});

router.post('/logout', isAuthed(), (req, res) => {
    req.logout();
    res.sendStatus(200);
});

export default router;
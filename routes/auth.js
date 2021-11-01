import { Router } from 'express';
import passport from 'passport';
import { isAuthed } from '../middleware/auth.js';

const router = new Router();

router.post('/local', passport.authenticate('local'), (req, res) => {
    res.status(200).json(req.user);
});

router.post('/', isAuthed(), (req, res) => {
    res.status(200).json(req.isAuthenticated());
});

export default router;
import { Router } from 'express';
import passport from 'passport';

const router = new Router();

router.post('/local', passport.authenticate('local'), (req, res) => {
    res.status(200).json(req.user);
});

router.post('/', (req, res) => {
    res.status(200).json(req.isAuthenticated());
});

export default router;
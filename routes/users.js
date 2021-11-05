'use strict';
import { Router } from 'express';
import { Users } from '../models/users.js';
import { body, param, validationResult } from 'express-validator';
import { hasSecurity, isAuthed } from '../middleware/auth.js';
import { Securities } from '../models/securities.js';
import passport from 'passport';
import { Passwords } from '../models/passwords.js';
import { catchValidationErrors, validPassword, validUser } from '../middleware/validators.js';

const router = new Router();

router.delete('/:id/securities/:security_id', [
    param('id').isNumeric().withMessage('must be numeric'),
    param('security_id').isNumeric().withMessage('must be numeric'),
    catchValidationErrors(),
    hasSecurity(Securities.TYPE.admin)
], async (req, res, next) => {
    try {
        const { id, security_id } = req.params;
        await Securities.revoke(id, security_id);
        res.sendStatus(200);
    } catch(e) {
        next(e);
    }
});

router.get('/:id/securities', [
    param('id').isNumeric().withMessage('must be numeric'),
    catchValidationErrors(),
    hasSecurity(Securities.TYPE.admin)
], async (req, res) => { // or isSelf('id')

    const { id } = req.params;

    res.status(200).json(await Securities.get(id));
});

router.post('/:id/securities', [
    param('id').isNumeric().withMessage('must be numeric'),
    body('security_id').isNumeric().withMessage('must be numeric'),
    catchValidationErrors(),
    hasSecurity(Securities.TYPE.admin)
], async (req, res) => {

    const { id } = req.params;
    const { security_id } = req.body;

    await Securities.assign(id, security_id)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            if (err === 'invalid security_id') return res.status(400).json({ error: err });
            if (err === 'invalid user_id') return res.status(400).json({ error: err });
            res.sendStatus(500);
        });
});

router.get('/:id', [
    param('id').isNumeric().withMessage('must be numeric'),
    catchValidationErrors()
], async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await Users.getById(id);
    
        if (!user) return res.sendStatus(404);
    
        res.status(200).json(await user.toDTO());
    } catch(e) {
        next(e);
    }
});

router.put('/password', [validPassword(), catchValidationErrors()], async (req, res, next) => {
    try {
        const { password } = req.body;

        await Passwords.update(req.user.id, password);
        res.sendStatus(200);
    } catch(e) {
        next(e);
    }
});

router.get('/', (req, res) => {
    res.status(200).json({ message: "not implemented" });
});

router.post('/', validUser(), async (req, res, next) => {
    try {
        const { username, nickname, email, password } = req.body;

        const user = await Users.create(username, nickname, email);
        await Passwords.insert(password, user.id);

        req.login(user, async err => {
            if (err) return next(err);
            res.status(200).json(await user.toDTO());
        });
    } catch(e) {
        return next(e);
    } 
});

router.put('/', [
    isAuthed(),
    body('username').notEmpty().withMessage("can't be empty"),
    body('nickname').notEmpty().withMessage("can't be empty"),
    body('email').isEmail().withMessage("invalid")
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, nickname, email } = req.body;

        req.user.username = username;
        req.user.nickname = nickname;
        if (req.user.email !== email) req.user.setEmail(email);
        
        await req.user.update();
    
        res.status(200).json(await req.user.toDTO());
    } catch(e) {
        next(e);
    }
});

router.delete('/', passport.authenticate('local'), (req, res, next) => {
    try {
        Passwords.delete(req.user.id);
        Securities.delete(req.user.id);
        Users.delete(req.user.id);
    
        req.logout();
        res.sendStatus(200);
    } catch(e) {
        next(e);
    }
});

export default router;
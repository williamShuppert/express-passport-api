'use strict';
import { Router } from 'express';
import { Users } from '../models/users.js';
import { body, param, validationResult } from 'express-validator';
import { hasSecurity } from '../middleware/auth.js';
import { Securities } from '../models/securities.js';

const router = new Router();

router.delete('/:id/securities/:security_id', [
    param('id').isNumeric().withMessage('must be numeric'),
    param('security_id').isNumeric().withMessage('must be numeric'),
    hasSecurity(Securities.TYPE.admin)
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id, security_id } = req.params;
    await Securities.revoke(id, security_id);
    res.sendStatus(200);
});

router.get('/:id/securities', [
    param('id').isNumeric().withMessage('must be numeric'),
    hasSecurity(Securities.TYPE.admin)
], async (req, res) => { // or isSelf('id')
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;

    res.status(200).json(await Securities.get(id));
});

router.post('/:id/securities', [
    param('id').isNumeric().withMessage('must be numeric'),
    body('security_id').isNumeric().withMessage('must be numeric'),
    hasSecurity(Securities.TYPE.admin)
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

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
    param('id').isNumeric().withMessage('must be numeric')
], async (req, res) => {
    const { id } = req.params;
    const user = await Users.getById(id);

    if (!user) return res.sendStatus(404);

    res.status(200).json(await user.toDTO());
});

router.get('/', (req, res) => {
    res.status(200).json({ message: "not implemented" });
});

router.post('/', [
    body('username').notEmpty().withMessage("can't be empty"),
    body('nickname').notEmpty().withMessage("can't be empty"),
    body('password').isStrongPassword({ minLength: 6, minSymbols: 1, minNumbers: 1, minUppercase: 1, minUppercase: 1 }).withMessage("not strong enough"),
    body('email').isEmail().withMessage("invalid")
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, nickname, email, password } = req.body;
    const user = await Users.create({ username, nickname, email, password });
    // TODO: catch dup err
    
    req.login(user, async err => {
        if (err) return next(err);
        res.status(200).json(await user.toDTO());
    });
});

export default router;
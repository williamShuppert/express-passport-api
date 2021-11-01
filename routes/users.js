'use strict';
import { Router } from 'express';
import { Users } from '../models/users.js';
import { body, validationResult } from 'express-validator';

const router = new Router();

router.get('/', (req, res) => {
    res.status(200).json(req.session);
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
    
    req.login(user, err => {
        if (err) return next(err);
        res.status(200).json(user.toDTO());
    });
});

export default router;
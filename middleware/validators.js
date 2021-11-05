import { body, param, validationResult } from 'express-validator';

export const validPassword = () => 
    body('password').isStrongPassword({
        minLength: 6,
        minSymbols: 1,
        minNumbers: 1,
        minUppercase: 1,
        minUppercase: 1
    }).withMessage("not strong enough");

export const validUsername = () =>
    body('username').notEmpty().withMessage("can't be empty");

export const validNickname = () =>
    body('nickname').notEmpty().withMessage("can't be empty");

export const validEmail = () =>
    body('email').isEmail().withMessage("invalid")

export const validUser = () => [
    validPassword(),
    validUsername(),
    validNickname(),
    validEmail(),
    catchValidationErrors()
]

export const catchValidationErrors = () => (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
}
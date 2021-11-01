'use strict';

export const isAuthed = () => (req, res, next) => {
    if (req.user) return next();
    return res.sendStatus(401);
}
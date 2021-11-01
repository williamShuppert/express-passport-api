'use strict';

export const isAuthed = () => (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.sendStatus(401);
}
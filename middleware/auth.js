'use strict';

export const isAuthed = () => (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.sendStatus(401);
}

export const hasSecurity = (securities) => [ isAuthed(), async (req, res, next) => {
    if (await req.user.hasSecurity(securities)) return next();
    res.sendStatus(403);
}];
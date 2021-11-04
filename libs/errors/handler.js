'use strict';
import { ERRORS } from "./enum.js";

export const errorHandler = () => (err, req, res, next) => {

    if (err.code === 'ER_DUP_ENTRY')
        if (err.sqlMessage.includes('users.username'))
            return res.status(400).json({ error: ERRORS.USERNAME_ALREADY_IN_USE }); 
        if (err.sqlMessage.includes('users.email'))
            return res.status(400).json({ error: ERRORS.EMAIL_ALREADY_IN_USE }); 

    console.log('unknown err:')
    console.log(err);
    res.sendStatus(500);
}
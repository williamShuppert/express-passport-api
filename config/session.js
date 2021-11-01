import MySQLStore from "express-mysql-session";
import { pool } from "./mysql.js";

const sessionStore = new MySQLStore({}, pool);

export const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV !== 'dev',
        maxAge: 900000,
        httpOnly: true
    },
    rolling: true,
    store: sessionStore,
}
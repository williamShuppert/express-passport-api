'use strict';
import db from "../config/mysql.js";
import bcrypt from 'bcrypt';

export class Passwords {
    constructor(sqlRes) {
        this.user_id = sqlRes.user_id;
        this.password = sqlRes.password;
    }

    async compare(password) {
        return await bcrypt.compare(password, this.password);
    }

    static async encrypt(password) {
        return await bcrypt.hash(password, 12);
    }

    static async compare(password, encryptedPassword) {
        return await bcrypt.compare(password, encryptedPassword);
    }

    static async update(user_id, password) {
        const encryptedPassword = Passwords.encrypt(password);
        return await db('UPDATE passwords SET password = ? WHERE user_id = ?', [encryptedPassword, user_id]);
    }

    static async get(user_id) {
        const sqlRes = await db('SELECT * FROM passwords WHERE user_id = ?', [user_id], true);
        if (!sqlRes) return undefined;
        return new Passwords(sqlRes);
    }

    static async insert(password, user_id) {
        const encryptedPassword = Passwords.encrypt(password);
        await db('INSERT INTO passwords (password, user_id) VALUE (?, ?)', [encryptedPassword, user_id]);
    }

    static async delete(user_id) {
        await db('DELETE FROM passwords WHERE user_id = ?', [user_id]);
    }
}
'use strict';
import db from "../config/mysql.js";

export class OAuth {
    constructor(sqlRes) {
        this.id = sqlRes.id;
        this.provider = sqlRes.provider;
        this.user_id = sqlRes.user_id;
    }

    static async get(provider, id) {
        const sqlRes = await db('SELECT * FROM oauth WHERE provider = ? AND oauth.id = ?', [provider, id], true);
        if (!sqlRes) return undefined;
        return new OAuth(sqlRes);
    }

    static async insert(provider, id, user_id) {
        await db('INSERT INTO oauth (provider, id, user_id) VALUE (?, ?, ?)', [provider, id, user_id]);
    }

    static async delete(user_id) {
        await db('REMOVE FROM oauth WHERE user_id = ?', [user_id]);
    }
}
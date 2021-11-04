import db from "../config/mysql.js";

export class OAuth {
    static async get(provider, id) {
        return await db('SELECT * FROM oauth JOIN users ON oauth.user_id = users.id WHERE provider = ? AND oauth.id = ?', [provider, id], true);
    }

    static async insert(provider, id, user_id) {
        await db('INSERT INTO oauth (provider, id, user_id) VALUE (?, ?, ?)', [provider, id, user_id]);
    }

    static async delete(user_id) {
        await db('REMOVE FROM oauth WHERE user_id = ?', [user_id]);
    }
}
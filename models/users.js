'use strict';
import db from '../config/mysql.js';
import { User } from './user.js';

export class Users {
    constructor(sqlRes) {
        this.users = [];
        for (let user of sqlRes) {
            this.users.push(new User(user));
        }
    }

    static async getById(id) {
        const user = await db('SELECT * FROM users WHERE id = ?', [id], true);
        return user ? new User(user) : undefined;
    }

    static async getByUsername(username, includeCredentials) {
        // remove includeCredentials
        const sqlRes = includeCredentials ?
            await db('SELECT * FROM users JOIN passwords ON users.id = passwords.user_id WHERE users.username = ?', [username], true):
            await db('SELECT * FROM users WHERE username = ?', [username], true);

        return sqlRes ? new User(sqlRes) : undefined;
    }

    static async create(username, nickname, email, email_verified = false) {
        const info = await db('INSERT INTO users (username, nickname, email, email_verified) VALUES (?, ?, ?, ?)', [username, nickname, email, email_verified]);
        const user = new User({ id: info.insertId , username, nickname, email, created_at: Date.now(), email_verified });
        return user;
    }

    static async delete(id) {
        await db('DELETE FROM users WHERE id = ?', [id]);
    }

    async toDTO() {
        let users = [];
        for (let user of this.users)
            users.push(await user.toDTO());
        return users;
    }
}
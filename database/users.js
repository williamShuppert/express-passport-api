'use strict';
import db from '../config/mysql.js';
import { User, Users } from '../models/users.js';

export default class UsersTable {

    static async get() {
        const users = await db('SELECT * FROM users');
        return users ? new Users(users) : undefined;
    }

    static async getByIdentifier(identifier) {
        const user = parseInt(identifier) ?
            await db('SELECT * FROM users WHERE id = ?', [identifier], true) :
            await db('SELECT * FROM users WHERE username = ?', [identifier], true);
        return user ? new User(user) : undefined;
    }

    static async getById(id) {
        const user = await db('SELECT * FROM users WHERE id = ?', [id], true);
        return user ? new User(user) : undefined;
    }

    static async getByUsername(username) {
        const user = await db('SELECT * FROM users WHERE username = ?', [username], true);
        return user ? new User(user) : undefined;
    }

    static async insert(username, nickname, email, password) {
        const info = await db('INSERT INTO users (username, nickname, email, password) VALUES (?, ?, ?, ?)', [username, nickname, email, password]);
        const user = new User({ id: info.insertId ,username, nickname, email, password, created_at: Date.now(), verified_email: false });
        return user;
    }

}
'use strict';
import db from '../config/mysql.js';
import bcrypt from 'bcrypt';

export class User {
    constructor(sqlRes) {
        this.id = sqlRes.id;
        this.username = sqlRes.username;
        this.nickname = sqlRes.nickname;
        this.email = sqlRes.nickname;
        this.password = sqlRes.password;
        this.verified_email = sqlRes.verified_email;
        this.created_at = sqlRes.created_at;
    }

    setEmail(email)
    {
        this.verified_email = false;
        this.email = email;
    }

    setPassword(password)
    {
        this.password = User.encryptPassword(password);
    }

    static encryptPassword(password) {
        return bcrypt.hashSync(password, 12);
    }

    toDTO()
    {
        return {
            id: this.id,
            username: this.username,
            nickname: this.nickname,
            created_at: this.created_at
        }
    }

    checkPassword(password)
    {
        return bcrypt.compareSync(password, this.password);
    }

    async save()
    {

        const sql = [
            'UPDATE users',
            'SET',
            '   username = ?',
            '   nickname = ?',
            '   email = ?',
            '   password = ?',
            '   verified_email = ?',
            'WHERE id = ?'
        ].join(' ');

        await db(sql, [
            this.username,
            this.nickname,
            this.email,
            this.password,
            this.verified_email,
            this.id
        ]);

        return this;
    
        // catch (err)
        // {
        //     if (err.code === 'ER_DUP_ENTRY')
        //         if (err.sqlMessage.includes('users.username'))
        //             throw "username already in use";
        //         else if (err.sqlMessage.includes('users.email'))
        //             throw "email already in use";
        //     throw err;
        // }

    }
}

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

    static async getByUsername(username) {
        const user = await db('SELECT * FROM users WHERE username = ?', [username], true);
        return user ? new User(user) : undefined;
    }

    static async create({ username, nickname, email, password }) {
        password = User.encryptPassword(password);
        const info = await db('INSERT INTO users (username, nickname, email, password) VALUES (?, ?, ?, ?)', [username, nickname, email, password]);
        const user = new User({ id: info.insertId ,username, nickname, email, password, created_at: Date.now(), verified_email: false });
        return user;
    }

    toDTO() {
        let users = [];
        for (let user of this.users)
            users.push(user.toDTO());
        return users;
    }
}
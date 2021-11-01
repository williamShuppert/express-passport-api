'use strict';
import db from '../config/mysql.js';
import UsersTable from '../database/users.js';
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
        if (!sqlRes.id)
        {
            this.setEmail(sqlRes.nickname);
            this.setPassword(sqlRes.password);
        }
    }

    static async create({ username, nickname, email, password }) {
        const user = await UsersTable.insert(username, nickname, email, this.encryptPassword(password));
        return user;
    }

    setEmail(email)
    {
        // if (this.validEmail(email)) throw "invalid email";
        this.verified_email = false;
        this.email = email;
    }

    setPassword(password)
    {
        // this.validPassword(password);
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

    toDTO() {
        let users = [];
        for (let user of this.users)
            users.push(user.toDTO());
        return users;
    }
}
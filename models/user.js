'use strict';
import db from '../config/mysql.js';
import { Securities } from './securities.js';

export class User {
    constructor(sqlRes) {
        this.id = sqlRes.id;
        this.username = sqlRes.username;
        this.nickname = sqlRes.nickname;
        this.email = sqlRes.email;
        this.email_verified = sqlRes.email_verified;
        this.created_at = sqlRes.created_at;
        this.password = sqlRes.password;
        this._securities = undefined;
        this._roles = undefined;
    }

    async securities() {
        if (!this._securities)
            this._securities = await Securities.getByUserId(this.id);
        return this._securities;
    }

    setEmail(email) {
        this.email_verified = false;
        this.email = email;
    }

    async update() {
        const sql = [
            'UPDATE users',
            'SET',
            '   username = ?,',
            '   nickname = ?,',
            '   email = ?,',
            '   email_verified = ?',
            'WHERE id = ?'
        ].join(' ');

        await db(sql, [
            this.username,
            this.nickname,
            this.email,
            this.email_verified,
            this.id
        ]);

        return this;
    }

    async toDTO(security = false) {
        const dto = {
            id: this.id,
            username: this.username,
            nickname: this.nickname,
            created_at: this.created_at
        }
        if (security) dto.securities = await this.getSecurities();
        return dto;
    }
}
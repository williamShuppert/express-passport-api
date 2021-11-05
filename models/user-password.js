import { User } from './user.js';
import { Passwords } from './passwords.js';
import db from '../config/mysql.js';

export class UserAndPassword extends User {
    constructor(sqlRes) {
        super(sqlRes);
        this.password = new Passwords(sqlRes);
    }

    static async getByUsername(username) {
        const sqlRes = await db('SELECT * FROM users JOIN passwords ON users.id = passwords.user_id WHERE username = ?', [username], true);
        return sqlRes ? new UserAndPassword(sqlRes) : undefined;
    }
}
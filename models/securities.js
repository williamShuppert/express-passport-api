'use strict';
import db from '../config/mysql.js';

export class Securities {

    static async getDescriptions() {
        return await db('SELECT * FROM security_descriptions');
    }

    static async getByUserId(id) {
        const sqlRes = await db('SELECT security_id FROM securities WHERE user_id = ?', id);
        
        const securities = [];
        for (let s of sqlRes)
            securities.push(s.security_id);

        return securities;
    }

    static async get(user_id) {
        return await db('SELECT sd.id as security_id, sd.description, if(s.user_id, true, false) as enabled FROM security_descriptions as sd LEFT JOIN securities as s ON s.security_id = sd.id AND s.user_id = 9', [user_id]);
    }

    static async assign(user_id, security_id) {
        await db('REPLACE INTO securities (user_id, security_id) VALUES (?, ?)', [user_id, security_id])
            .catch(err => {
                if (err.code.includes('ER_NO_REFERENCED_ROW'))
                    if (err.sqlMessage.includes('security_id')) throw 'invalid security_id';
                    else if (err.sqlMessage.includes('user_id')) throw 'invalid user_id';

                throw err;
            });
    }

    static async revoke(user_id, security_id) {
        await db('DELETE FROM securities WHERE user_id = ? AND security_id = ?', [user_id, security_id]);
    }

}

Securities.TYPE = {
    'admin': 1
}
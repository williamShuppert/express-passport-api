'use strict';
import mysql from 'mysql2/promise';

const dbOptions = {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}

await mysql.createConnection(dbOptions)
    .then(con => {
        console.log('db connected');
        con.destroy();
    }).catch(e => {
        console.log(e);
    });
    
export const pool = mysql.createPool(dbOptions);

export default async function db(query, params, singleResponse = false)
{
    const response = (await pool.query(query, params))[0];
    return singleResponse ? response[0] : response;
}
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
    
export const pool = mysql.createPool(dbOptions);

export default async function db(query, params, singleResponse = false)
{
    const response = (await pool.query(query, params))[0];
    return singleResponse ? response[0] : response;
}

await db('SELECT 1 + 1 AS solution')
    .then(() => console.log('db connected'))
    .catch(err => console.log(`db failed to connect: ${err}`));
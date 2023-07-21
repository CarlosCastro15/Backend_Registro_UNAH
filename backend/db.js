import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',

    password: 'Halo117',

    port: 3306,
    database: 'backend'
});

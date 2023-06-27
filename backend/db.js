import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Estefany19985.',
    port: 3306,
    database: 'primer_sprint'
});

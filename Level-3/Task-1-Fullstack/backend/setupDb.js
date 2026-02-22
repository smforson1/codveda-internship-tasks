const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres', // Initial connection to create database if not exists
});

async function setupDatabase() {
    try {
        const res = await pool.query(`SELECT 1 FROM pg_database WHERE datname='${process.env.DB_NAME}'`);
        if (res.rowCount === 0) {
            await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database ${process.env.DB_NAME} created.`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await pool.end();
    }
}

module.exports = setupDatabase;

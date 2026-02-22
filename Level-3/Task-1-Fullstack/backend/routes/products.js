const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ message: 'Name and price are required.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO products (name, price, user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, price, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.json({ message: 'Deleted.', product: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

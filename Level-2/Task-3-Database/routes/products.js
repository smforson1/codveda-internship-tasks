const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /products - Get all products
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /products/:id - Get single product
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /products - Create a product
router.post('/', async (req, res) => {
    const { name, price } = req.body;

    // Validation
    if (!name || price === undefined) {
        return res.status(400).json({ message: 'name and price are required.' });
    }
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'price must be a non-negative number.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO products(name, price) VALUES($1, $2) RETURNING *',
            [name, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /products/:id - Update a product
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    try {
        const result = await pool.query(
            `UPDATE products 
       SET name  = COALESCE($1, name),
           price = COALESCE($2, price)
       WHERE id = $3
       RETURNING *`,
            [name, price, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /products/:id - Delete a product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted', product: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDB = require('./initDB');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/products', productRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Initialize DB then start server
initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Database API running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize DB:', err.message);
        process.exit(1);
    });

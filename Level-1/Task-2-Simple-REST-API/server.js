const express = require('express');
const app = express();
const port = 3000;
const productRoutes = require('./routes/products');
const cors = require('cors');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Mount routes
app.use('/products', productRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Simple REST API. Visit /products to see data.');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

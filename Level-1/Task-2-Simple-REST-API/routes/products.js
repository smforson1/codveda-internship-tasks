const express = require('express');
const router = express.Router();

// In-memory data store
let products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 699 }
];

// GET /products - Get all products
router.get('/', (req, res) => {
    res.json(products);
});

// GET /products/:id - Get a single product
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// POST /products - Create a new product
router.post('/', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };

    if (!newProduct.name || !newProduct.price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT /products/:id - Update a product
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
        const updatedProduct = {
            ...products[productIndex],
            name: req.body.name || products[productIndex].name,
            price: req.body.price || products[productIndex].price
        };
        products[productIndex] = updatedProduct;
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// DELETE /products/:id - Delete a product
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1);
        res.json({ message: 'Product deleted', product: deletedProduct[0] });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const setupDatabase = require('./setupDb');
const initDB = require('./initDB');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

async function startServer() {
    await setupDatabase();
    await initDB();
    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
}

startServer();

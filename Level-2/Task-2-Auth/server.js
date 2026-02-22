const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/', protectedRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Auth API is running. Use /auth/signup or /auth/login.' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
});

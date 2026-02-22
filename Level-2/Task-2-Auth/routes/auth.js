const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory user store (keyed by email)
const users = {};

// POST /auth/signup
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    if (users[email]) {
        return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    users[email] = {
        name,
        email,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'user', // only allow 'admin' or 'user'
    };

    res.status(201).json({ message: `User "${name}" registered successfully.` });
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = users[email];
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Sign JWT token with user info and role
    const token = jwt.sign(
        { name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({
        message: 'Login successful.',
        token,
        user: { name: user.name, email: user.email, role: user.role },
    });
});

module.exports = router;

const express = require('express');
const { verifyToken, requireAdmin } = require('../middleware/verifyToken');
const router = express.Router();

// Protected route - any logged-in user
router.get('/dashboard', verifyToken, (req, res) => {
    res.json({
        message: `Welcome to your dashboard, ${req.user.name}!`,
        user: req.user,
    });
});

// Admin-only route
router.get('/admin', verifyToken, requireAdmin, (req, res) => {
    res.json({
        message: `Welcome to the Admin Panel, ${req.user.name}!`,
        user: req.user,
    });
});

module.exports = router;

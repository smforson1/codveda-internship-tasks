const jwt = require('jsonwebtoken');

/**
 * Middleware: verifies JWT from Authorization header.
 * Attaches decoded user payload to req.user.
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
}

/**
 * Middleware: restricts access to users with role 'admin'.
 * Must be used AFTER verifyToken.
 */
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}

module.exports = { verifyToken, requireAdmin };

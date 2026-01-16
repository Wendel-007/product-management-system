const jwt = require("jsonwebtoken");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generate JWT token
 */
function generateToken(user) {
	const payload = {
		id: user.id,
		username: user.username,
		type: user.type || "user",
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			throw new Error("Token expired");
		} else if (error.name === "JsonWebTokenError") {
			throw new Error("Invalid token");
		} else {
			throw new Error("Token verification failed");
		}
	}
}

/**
 * Extract token from request
 * Supports both Authorization header and cookie
 */
function extractToken(req) {
	// Try Authorization header first (Bearer token)
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer ")) {
		return authHeader.substring(7);
	}

	// Try cookie
	if (req.cookies && req.cookies.token) {
		return req.cookies.token;
	}

	return null;
}

/**
 * Get the secret in the format needed for jwt.io verification
 * For jwt.io: paste the secret exactly as stored in .env (hex string)
 */
function getSecretForJwtIo() {
	return JWT_SECRET;
}

module.exports = {
	generateToken,
	verifyToken,
	extractToken,
	getSecretForJwtIo,
};

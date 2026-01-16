const { extractToken, verifyToken } = require("../utils/jwt");

/**
 * Middleware to check if user is authenticated (has valid JWT)
 */
function requireAuth(req, res, next) {
	try {
		const token = extractToken(req);

		if (!token) {
			return res.status(401).json({
				error: "Authentication required",
				message: "Please provide a valid token",
			});
		}

		// Verify token
		const decoded = verifyToken(token);

		// Attach user info to request
		req.user = {
			id: decoded.id,
			username: decoded.username,
			type: decoded.type || "user",
		};

		next();
	} catch (error) {
		return res.status(401).json({
			error: "Invalid or expired token",
			message: error.message,
		});
	}
}

/**
 * Middleware to check if user is admin
 */
function requireAdmin(req, res, next) {
	// First check authentication
	if (!req.user) {
		return res.status(401).json({
			error: "Authentication required",
			message: "Please provide a valid token",
		});
	}

	// Then check if user is admin
	if (req.user.type !== "admin") {
		return res.status(403).json({
			error: "Forbidden",
			message: "Admin privileges required",
		});
	}

	next();
}

module.exports = {
	requireAuth,
	requireAdmin,
};

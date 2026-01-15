/**
 * Middleware to prevent opening in iframe (except for docs)
 */
const securityHeaders = (req, res, next) => {
	if (req.path === "/docs" || req.path.startsWith("/api-docs")) {
		// Allow ReDoc to load external resources
		res.setHeader(
			"Content-Security-Policy",
			"default-src 'self' https://unpkg.com https://cdn.redoc.ly; script-src 'self' https://unpkg.com https://cdn.redoc.ly 'unsafe-inline'; style-src 'self' https://unpkg.com https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com;"
		);
	} else {
		res.setHeader("X-Frame-Options", "DENY");
		res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
	}
	next();
};

module.exports = {
	securityHeaders,
};

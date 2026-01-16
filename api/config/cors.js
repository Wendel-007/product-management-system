const cors = require("cors");

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps, curl, Postman, or same-origin requests)
		if (!origin) {
			return callback(null, true);
		}
		// Allow same-origin requests and allowed origin
		if (origin === ALLOWED_ORIGIN) {
			return callback(null, true);
		}
		callback(null, true);
	},
	credentials: true, // Allow cookies to be sent
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"], // Allow Authorization header for JWT
	exposedHeaders: ["Authorization"], // Expose Authorization header if needed
};

module.exports = {
	corsMiddleware: cors(corsOptions),
	ALLOWED_ORIGIN,
};

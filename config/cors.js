const cors = require("cors");

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000";

const corsOptions = {
	origin: ALLOWED_ORIGIN,
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = {
	corsMiddleware: cors(corsOptions),
	ALLOWED_ORIGIN,
};

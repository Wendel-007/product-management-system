require("dotenv").config();
const app = require("./app");
const { initDatabase, closeDatabase } = require("./config/database");
const { ALLOWED_ORIGIN } = require("./config/cors");

const PORT = process.env.PORT || 3000;

/**
 * Initialize and start the server
 */
async function startServer() {
	try {
		// Initialize database
		await initDatabase();

		// Start server
		app.listen(PORT, () => {
			console.log("=".repeat(50));
			console.log(`🚀 Server running on port ${PORT}`);
			console.log(`🌐 Allowed origin: ${ALLOWED_ORIGIN}`);
			console.log("=".repeat(50));
			console.log("📚 API Endpoints:");
			console.log(`   Products:  http://localhost:${PORT}/api/product`);
			console.log(`   Customers: http://localhost:${PORT}/api/customer`);
			console.log(`   Orders:    http://localhost:${PORT}/api/order`);
			console.log(`   Docs:      http://localhost:${PORT}/docs`);
			console.log("=".repeat(50));
		});
	} catch (error) {
		console.error("❌ Error initializing server:", error);
		process.exit(1);
	}
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal) {
	console.log(`\n${signal} received. Closing server gracefully...`);
	await closeDatabase();
	process.exit(0);
}

// Handle process termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
	console.error("Unhandled Promise Rejection:", error);
	process.exit(1);
});

// Start application
startServer();

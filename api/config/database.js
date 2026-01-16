const { ClassicLevel } = require("classic-level");
const path = require("path");
const fs = require("fs");

const DB_DIR = path.join(__dirname, "..", "data");

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
	fs.mkdirSync(DB_DIR, { recursive: true });
}

// Database instances
const databases = {
	users: null,
	products: null,
	customers: null,
	orders: null,
};

// Initialize all databases
async function initDatabase() {
	try {
		// Initialize users database
		databases.users = new ClassicLevel(path.join(DB_DIR, "users.db"), {
			valueEncoding: "json",
		});
		await databases.users.open();
		console.log("Users database initialized");

		// Initialize products database
		databases.products = new ClassicLevel(path.join(DB_DIR, "products.db"), {
			valueEncoding: "json",
		});
		await databases.products.open();
		console.log("Products database initialized");

		// Initialize customers database
		databases.customers = new ClassicLevel(path.join(DB_DIR, "customers.db"), {
			valueEncoding: "json",
		});
		await databases.customers.open();
		console.log("Customers database initialized");

		// Initialize orders database
		databases.orders = new ClassicLevel(path.join(DB_DIR, "orders.db"), {
			valueEncoding: "json",
		});
		await databases.orders.open();
		console.log("Orders database initialized");

		console.log("All databases initialized successfully");
	} catch (error) {
		console.error("Error initializing databases:", error);
		throw error;
	}
}

// Get database instance by name
function getDatabase(name) {
	if (!databases[name]) {
		throw new Error(`Database '${name}' not initialized. Call initDatabase() first.`);
	}
	return databases[name];
}

// Get all database instances
function getAllDatabases() {
	return databases;
}

// Close all database connections
async function closeDatabase() {
	const closePromises = [];
	
	for (const [name, db] of Object.entries(databases)) {
		if (db) {
			closePromises.push(
				db.close().then(() => {
					console.log(`${name} database closed`);
				}).catch((err) => {
					console.error(`Error closing ${name} database:`, err);
				})
			);
		}
	}
	
	await Promise.all(closePromises);
	console.log("All database connections closed");
}

module.exports = {
	initDatabase,
	getDatabase,
	getAllDatabases,
	closeDatabase,
};

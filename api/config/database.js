const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "products.db");

let db = null;

// Initialize database
function initDatabase() {
	return new Promise((resolve, reject) => {
		db = new sqlite3.Database(DB_PATH, (err) => {
			if (err) {
				console.error("Error connecting to database:", err.message);
				reject(err);
				return;
			}
			console.log("Connected to SQLite database");

			// Create products table if it doesn't exist
			db.run(
				`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value REAL NOT NULL
      )`,
				(err) => {
					if (err) {
						console.error("Error creating products table:", err.message);
						reject(err);
						return;
					}
					console.log("Products table created/verified");

					// Create orders table if it doesn't exist
					db.run(
						`CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          items TEXT NOT NULL,
          customer_id INTEGER
        )`,
						(err) => {
							if (err) {
								console.error("Error creating orders table:", err.message);
								reject(err);
								return;
							}
							console.log("Orders table created/verified");

							// Create customers table if it doesn't exist
							db.run(
								`CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL
          )`,
								(err) => {
									if (err) {
										console.error(
											"Error creating customers table:",
											err.message
										);
										reject(err);
									} else {
										console.log("Customers table created/verified");
										resolve(db);
									}
								}
							);
						}
					);
				}
			);
		});
	});
}

// Get database instance
function getDatabase() {
	if (!db) {
		throw new Error("Database not initialized. Call initDatabase() first.");
	}
	return db;
}

// Close database connection
function closeDatabase() {
	return new Promise((resolve, reject) => {
		if (db) {
			db.close((err) => {
				if (err) {
					console.error(err.message);
					reject(err);
				} else {
					console.log("Database connection closed.");
					db = null;
					resolve();
				}
			});
		} else {
			resolve();
		}
	});
}

module.exports = {
	initDatabase,
	getDatabase,
	closeDatabase,
};

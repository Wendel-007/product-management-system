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

										// Create users table if it doesn't exist
										db.run(
											`CREATE TABLE IF NOT EXISTS users (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      username TEXT NOT NULL UNIQUE,
                      password TEXT NOT NULL,
                      type TEXT NOT NULL DEFAULT 'user',
                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )`,
											(err) => {
												if (err) {
													console.error(
														"Error creating users table:",
														err.message
													);
													reject(err);
												} else {
													console.log("Users table created/verified");
													
													// Add type column if it doesn't exist (migration)
													// Check if column exists first
													db.all("PRAGMA table_info(users)", [], (err, columns) => {
														if (err) {
															console.error("Error checking table info:", err.message);
															resolve(db);
															return;
														}
														
														const hasTypeColumn = columns.some(col => col.name === 'type');
														
														if (!hasTypeColumn) {
															db.run(
																`ALTER TABLE users ADD COLUMN type TEXT DEFAULT 'user'`,
																(err) => {
																	if (err) {
																		console.error("Error adding type column:", err.message);
																	} else {
																		console.log("Type column added to users table");
																		// Update existing users to 'user' type if null
																		db.run(
																			"UPDATE users SET type = 'user' WHERE type IS NULL",
																			(err) => {
																				if (err) {
																					console.error("Error updating existing users:", err.message);
																				}
																			}
																		);
																	}
																	resolve(db);
																}
															);
														} else {
															resolve(db);
														}
													});
												}
											}
										);
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

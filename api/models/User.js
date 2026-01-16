const { getDatabase } = require("../config/database");
const bcrypt = require("bcrypt");

class User {
	/**
	 * Find user by username
	 */
	static findByUsername(username) {
		return new Promise((resolve, reject) => {
			const db = getDatabase();
			db.get(
				"SELECT * FROM users WHERE username = ?",
				[username],
				(err, row) => {
					if (err) {
						reject(err);
					} else {
						resolve(row);
					}
				}
			);
		});
	}

	/**
	 * Find user by ID
	 */
	static findById(id) {
		return new Promise((resolve, reject) => {
			const db = getDatabase();
			db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			});
		});
	}

	/**
	 * Get all users
	 */
	static findAll() {
		return new Promise((resolve, reject) => {
			const db = getDatabase();
			db.all(
				"SELECT id, username, type, created_at FROM users ORDER BY created_at DESC",
				[],
				(err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				}
			);
		});
	}

	/**
	 * Create a new user
	 */
	static async create(username, password, type = "user") {
		return new Promise(async (resolve, reject) => {
			try {
				// Validate type
				if (type !== "admin" && type !== "user") {
					reject(new Error("Invalid user type. Must be 'admin' or 'user'"));
					return;
				}

				const hashedPassword = await bcrypt.hash(password, 10);
				const db = getDatabase();
				db.run(
					"INSERT INTO users (username, password, type) VALUES (?, ?, ?)",
					[username, hashedPassword, type],
					function (err) {
						if (err) {
							reject(err);
						} else {
							resolve({ id: this.lastID, username, type });
						}
					}
				);
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Update user
	 */
	static async update(username, data) {
		return new Promise(async (resolve, reject) => {
			try {
				const db = getDatabase();
				const updates = [];
				const values = [];

				if (data.password) {
					const hashedPassword = await bcrypt.hash(data.password, 10);
					updates.push("password = ?");
					values.push(hashedPassword);
				}

				if (data.type) {
					if (data.type !== "admin" && data.type !== "user") {
						reject(new Error("Invalid user type. Must be 'admin' or 'user'"));
						return;
					}
					updates.push("type = ?");
					values.push(data.type);
				}

				if (updates.length === 0) {
					reject(new Error("No fields to update"));
					return;
				}

				values.push(username);

				db.run(
					`UPDATE users SET ${updates.join(", ")} WHERE username = ?`,
					values,
					function (err) {
						if (err) {
							reject(err);
						} else {
							if (this.changes === 0) {
								reject(new Error("User not found"));
							} else {
								resolve({ username, ...data });
							}
						}
					}
				);
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Delete user
	 */
	static delete(username) {
		return new Promise((resolve, reject) => {
			const db = getDatabase();
			db.run("DELETE FROM users WHERE username = ?", [username], function (err) {
				if (err) {
					reject(err);
				} else {
					if (this.changes === 0) {
						reject(new Error("User not found"));
					} else {
						resolve({ username });
					}
				}
			});
		});
	}

	/**
	 * Verify password
	 */
	static async verifyPassword(plainPassword, hashedPassword) {
		return await bcrypt.compare(plainPassword, hashedPassword);
	}
}

module.exports = User;

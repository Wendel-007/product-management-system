const { getDatabase } = require("../config/database");
const bcrypt = require("bcrypt");

const NEXT_ID_KEY = "__nextId__";

// Helper function to get next ID
async function getNextId(db) {
	try {
		const currentId = await db.get(NEXT_ID_KEY);
		const nextId = currentId ? currentId + 1 : 1;
		await db.put(NEXT_ID_KEY, nextId);
		return nextId;
	} catch (error) {
		// If key doesn't exist, start from 1
		if (error.code === "LEVEL_NOT_FOUND") {
			await db.put(NEXT_ID_KEY, 2);
			return 1;
		}
		throw error;
	}
}

class User {
	/**
	 * Find user by username
	 */
	static async findByUsername(username) {
		const db = getDatabase("users");
		
		try {
			// Iterate through all users to find by username
			for await (const [key, value] of db.iterator()) {
				if (key === NEXT_ID_KEY) continue;
				
				if (value.username === username) {
					return {
						id: parseInt(key),
						...value,
					};
				}
			}
			return null;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find user by ID
	 */
	static async findById(id) {
		const db = getDatabase("users");
		
		try {
			const user = await db.get(id.toString());
			if (!user) {
				return null;
			}
			return {
				id: parseInt(id),
				...user,
			};
		} catch (error) {
			if (error.code === "LEVEL_NOT_FOUND") {
				return null;
			}
			throw error;
		}
	}

	/**
	 * Get all users
	 */
	static async findAll() {
		const db = getDatabase("users");
		
		try {
			const users = [];
			for await (const [key, value] of db.iterator()) {
				if (key === NEXT_ID_KEY) continue;
				
				users.push({
					id: parseInt(key),
					username: value.username,
					type: value.type || "user",
					created_at: value.created_at,
				});
			}
			
			// Sort by created_at descending, then by id
			users.sort((a, b) => {
				const dateA = new Date(a.created_at || 0);
				const dateB = new Date(b.created_at || 0);
				if (dateB.getTime() !== dateA.getTime()) {
					return dateB.getTime() - dateA.getTime();
				}
				return b.id - a.id;
			});
			
			return users;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Create a new user
	 */
	static async create(username, password, type = "user") {
		try {
			// Validate type
			if (type !== "admin" && type !== "user") {
				throw new Error("Invalid user type. Must be 'admin' or 'user'");
			}

			// Check if username already exists
			const existingUser = await this.findByUsername(username);
			if (existingUser) {
				throw new Error("Username already exists");
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const db = getDatabase("users");
			
			const id = await getNextId(db);
			const now = new Date().toISOString();
			
			const user = {
				username,
				password: hashedPassword,
				type,
				created_at: now,
			};
			
			await db.put(id.toString(), user);
			
			return {
				id,
				username,
				type,
			};
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Update user
	 */
	static async update(username, data) {
		try {
			const db = getDatabase("users");
			
			// Find user by username
			const user = await this.findByUsername(username);
			if (!user) {
				throw new Error("User not found");
			}

			const updates = { ...user };
			delete updates.id; // Remove id from updates object

			if (data.password) {
				updates.password = await bcrypt.hash(data.password, 10);
			}

			if (data.type) {
				if (data.type !== "admin" && data.type !== "user") {
					throw new Error("Invalid user type. Must be 'admin' or 'user'");
				}
				updates.type = data.type;
			}

			// Save updated user
			await db.put(user.id.toString(), updates);

			return {
				username,
				...data,
			};
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Delete user
	 */
	static async delete(username) {
		try {
			const db = getDatabase("users");
			
			// Find user by username
			const user = await this.findByUsername(username);
			if (!user) {
				throw new Error("User not found");
			}

			await db.del(user.id.toString());

			return { username };
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Verify password
	 */
	static async verifyPassword(plainPassword, hashedPassword) {
		return await bcrypt.compare(plainPassword, hashedPassword);
	}
}

module.exports = User;

const { getDatabase } = require("../config/database");

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

class Customer {
	// Find all customers
	static findAll(callback) {
		const db = getDatabase("customers");
		
		(async () => {
			try {
				const customers = [];
				for await (const [key, value] of db.iterator()) {
					if (key === NEXT_ID_KEY) continue;
					
					customers.push({
						id: parseInt(key),
						name: value.name,
						email: value.email,
					});
				}
				
				// Sort by id
				customers.sort((a, b) => a.id - b.id);
				
				callback(null, customers);
			} catch (error) {
				callback(error, null);
			}
		})();
	}

	// Find customer by ID
	static findById(id, callback) {
		const db = getDatabase("customers");
		
		(async () => {
			try {
				const customer = await db.get(id.toString());
				if (!customer) {
					callback(null, null);
					return;
				}
				
				callback(null, {
					id: parseInt(id),
					name: customer.name,
					email: customer.email,
				});
			} catch (error) {
				if (error.code === "LEVEL_NOT_FOUND") {
					callback(null, null);
				} else {
					callback(error, null);
				}
			}
		})();
	}

	// Create new customer
	static create(name, email, callback) {
		const db = getDatabase("customers");
		
		(async () => {
			try {
				const id = await getNextId(db);
				
				const customer = {
					name: name,
					email: email,
				};
				
				await db.put(id.toString(), customer);
				
				callback(null, {
					id: id,
					name: name,
					email: email,
				});
			} catch (error) {
				callback(error, null);
			}
		})();
	}

	// Update customer
	static update(id, name, email, callback) {
		const db = getDatabase("customers");
		
		(async () => {
			try {
				// Check if customer exists
				const existing = await db.get(id.toString());
				if (!existing) {
					callback(new Error("Customer not found"), null);
					return;
				}
				
				const customer = {
					name: name,
					email: email,
				};
				
				await db.put(id.toString(), customer);
				
				callback(null, {
					id: parseInt(id),
					name: name,
					email: email,
				});
			} catch (error) {
				if (error.code === "LEVEL_NOT_FOUND") {
					callback(new Error("Customer not found"), null);
				} else {
					callback(error, null);
				}
			}
		})();
	}

	// Delete customer
	static delete(id, callback) {
		const db = getDatabase("customers");
		
		(async () => {
			try {
				// Check if customer exists
				const existing = await db.get(id.toString());
				if (!existing) {
					callback(new Error("Customer not found"), false);
					return;
				}
				
				await db.del(id.toString());
				callback(null, true);
			} catch (error) {
				if (error.code === "LEVEL_NOT_FOUND") {
					callback(new Error("Customer not found"), false);
				} else {
					callback(error, false);
				}
			}
		})();
	}
}

module.exports = Customer;

const { getDatabase } = require('../config/database');

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

class Product {
	// Find all products
	static findAll(callback) {
		const db = getDatabase("products");
		
		(async () => {
			try {
				const products = [];
				for await (const [key, value] of db.iterator()) {
					if (key === NEXT_ID_KEY) continue;
					
					products.push({
						id: parseInt(key),
						name: value.name,
						value: parseFloat(value.value.toFixed(2)),
					});
				}
				
				// Sort by id
				products.sort((a, b) => a.id - b.id);
				
				callback(null, products);
			} catch (error) {
				callback(error, null);
			}
		})();
	}

	// Find product by ID
	static findById(id, callback) {
		const db = getDatabase("products");
		
		(async () => {
			try {
				const product = await db.get(id.toString());
				if (!product) {
					callback(null, null);
					return;
				}
				
				callback(null, {
					id: parseInt(id),
					name: product.name,
					value: parseFloat(product.value.toFixed(2)),
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

	// Create new product
	static create(name, value, callback) {
		const db = getDatabase("products");
		const numValue = parseFloat(value);
		
		(async () => {
			try {
				const id = await getNextId(db);
				
				const product = {
					name: name,
					value: numValue,
				};
				
				await db.put(id.toString(), product);
				
				callback(null, {
					id: id,
					name: name,
					value: parseFloat(numValue.toFixed(2)),
				});
			} catch (error) {
				callback(error, null);
			}
		})();
	}

	// Update product
	static update(id, name, value, callback) {
		const db = getDatabase("products");
		const numValue = parseFloat(value);
		
		(async () => {
			try {
				// Check if product exists
				const existing = await db.get(id.toString());
				if (!existing) {
					callback(new Error("Product not found"), null);
					return;
				}
				
				const product = {
					name: name,
					value: numValue,
				};
				
				await db.put(id.toString(), product);
				
				callback(null, {
					id: parseInt(id),
					name: name,
					value: parseFloat(numValue.toFixed(2)),
				});
			} catch (error) {
				if (error.code === "LEVEL_NOT_FOUND") {
					callback(new Error("Product not found"), null);
				} else {
					callback(error, null);
				}
			}
		})();
	}

	// Delete product
	static delete(id, callback) {
		const db = getDatabase("products");
		
		(async () => {
			try {
				// Check if product exists
				const existing = await db.get(id.toString());
				if (!existing) {
					callback(new Error("Product not found"), false);
					return;
				}
				
				await db.del(id.toString());
				callback(null, true);
			} catch (error) {
				if (error.code === "LEVEL_NOT_FOUND") {
					callback(new Error("Product not found"), false);
				} else {
					callback(error, false);
				}
			}
		})();
	}
}

module.exports = Product;

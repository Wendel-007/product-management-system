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

class Order {
	// Find all orders
	static findAll(callback) {
		const db = getDatabase("orders");
		
		(async () => {
			try {
				const orders = [];
				for await (const [key, value] of db.iterator()) {
					if (key === NEXT_ID_KEY) continue;
					
					orders.push({
						id: parseInt(key),
						items: value.items,
						customer_id: value.customer_id || null,
					});
				}
				
				// Sort by id
				orders.sort((a, b) => a.id - b.id);
				
				callback(null, orders);
			} catch (error) {
				callback(error, null);
			}
		})();
	}

	// Find order by ID
	static findById(id, callback) {
		const db = getDatabase("orders");
		
		(async () => {
			try {
				const order = await db.get(id.toString());
				if (!order) {
					callback(null, null);
					return;
				}
				
				callback(null, {
					id: parseInt(id),
					items: order.items,
					customer_id: order.customer_id || null,
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

	// Create new order
	static create(items, customerId, callback) {
		const db = getDatabase("orders");
		
		(async () => {
			try {
				const id = await getNextId(db);
				
				const order = {
					items: items,
					customer_id: customerId || null,
				};
				
				await db.put(id.toString(), order);
				
				callback(null, {
					id: id,
					items: items,
					customer_id: customerId,
				});
			} catch (error) {
				callback(error, null);
			}
		})();
	}

	// Update order
	static update(id, items, customerId, callback) {
		const db = getDatabase("orders");
		
		(async () => {
			try {
				// Check if order exists
				const existing = await db.get(id.toString());
				if (!existing) {
					callback(new Error("Order not found"), null);
					return;
				}
				
				const order = {
					items: items,
					customer_id: customerId || null,
				};
				
				await db.put(id.toString(), order);
				
				callback(null, {
					id: parseInt(id),
					items: items,
					customer_id: customerId,
				});
			} catch (error) {
				if (error.code === "LEVEL_NOT_FOUND") {
					callback(new Error("Order not found"), null);
				} else {
					callback(error, null);
				}
			}
		})();
	}

	// Delete order
	static delete(id, callback) {
		const db = getDatabase("orders");
		
		(async () => {
			try {
				// Check if order exists
				const existing = await db.get(id.toString());
				if (!existing) {
					callback(new Error("Order not found"), false);
					return;
				}
				
				await db.del(id.toString());
				callback(null, true);
			} catch (error) {
				if (error.code === "LEVEL_NOT_FOUND") {
					callback(new Error("Order not found"), false);
				} else {
					callback(error, false);
				}
			}
		})();
	}

	// Find orders by product_id
	static findByProductId(productId, callback) {
		const db = getDatabase("orders");
		
		(async () => {
			try {
				const orders = [];
				for await (const [key, value] of db.iterator()) {
					if (key === NEXT_ID_KEY) continue;
					
					// Check if order contains the product
					if (value.items && Array.isArray(value.items)) {
						const hasProduct = value.items.some((item) => item.id === productId);
						if (hasProduct) {
							orders.push({
								id: parseInt(key),
								items: value.items,
								customer_id: value.customer_id || null,
							});
						}
					}
				}
				
				// Sort by id
				orders.sort((a, b) => a.id - b.id);
				
				callback(null, orders);
			} catch (error) {
				callback(error, null);
			}
		})();
	}

	// Find orders by customer_id
	static findByCustomerId(customerId, callback) {
		const db = getDatabase("orders");
		
		(async () => {
			try {
				const orders = [];
				for await (const [key, value] of db.iterator()) {
					if (key === NEXT_ID_KEY) continue;
					
					// Check if order belongs to customer
					if (value.customer_id === customerId) {
						orders.push({
							id: parseInt(key),
							items: value.items,
							customer_id: value.customer_id || null,
						});
					}
				}
				
				// Sort by id
				orders.sort((a, b) => a.id - b.id);
				
				callback(null, orders);
			} catch (error) {
				callback(error, null);
			}
		})();
	}
}

module.exports = Order;

const { getDatabase } = require("../config/database");

class Order {
	// Find all orders
	static findAll(callback) {
		const db = getDatabase();
		db.all("SELECT * FROM orders ORDER BY id", [], (err, rows) => {
			if (err) {
				callback(err, null);
				return;
			}
			// Parse JSON items
			const orders = rows.map((row) => ({
				id: row.id,
				items: JSON.parse(row.items),
				customer_id: row.customer_id || null,
			}));
			callback(null, orders);
		});
	}

	// Find order by ID
	static findById(id, callback) {
		const db = getDatabase();
		db.get("SELECT * FROM orders WHERE id = ?", [id], (err, row) => {
			if (err) {
				callback(err, null);
				return;
			}
			if (!row) {
				callback(null, null);
				return;
			}
			// Parse JSON items
			const order = {
				id: row.id,
				items: JSON.parse(row.items),
				customer_id: row.customer_id || null,
			};
			callback(null, order);
		});
	}

	// Create new order
	static create(items, customerId, callback) {
		const db = getDatabase();
		const itemsJson = JSON.stringify(items);

		db.run(
			"INSERT INTO orders (items, customer_id) VALUES (?, ?)",
			[itemsJson, customerId],
			function (err) {
				if (err) {
					callback(err, null);
					return;
				}
				const order = {
					id: this.lastID,
					items: items,
					customer_id: customerId,
				};
				callback(null, order);
			}
		);
	}

	// Update order
	static update(id, items, customerId, callback) {
		const db = getDatabase();
		const itemsJson = JSON.stringify(items);

		db.run(
			"UPDATE orders SET items = ?, customer_id = ? WHERE id = ?",
			[itemsJson, customerId, id],
			(err) => {
				if (err) {
					callback(err, null);
					return;
				}
				const order = {
					id: id,
					items: items,
					customer_id: customerId,
				};
				callback(null, order);
			}
		);
	}

	// Delete order
	static delete(id, callback) {
		const db = getDatabase();
		db.run("DELETE FROM orders WHERE id = ?", [id], (err) => {
			if (err) {
				callback(err, false);
				return;
			}
			callback(null, true);
		});
	}

	// Find orders by product_id
	static findByProductId(productId, callback) {
		const db = getDatabase();
		db.all("SELECT * FROM orders ORDER BY id", [], (err, rows) => {
			if (err) {
				callback(err, null);
				return;
			}
			// Filter orders that contain the product
			const orders = rows
				.map((row) => {
					try {
						const items = JSON.parse(row.items);
						return {
							id: row.id,
							items: items,
							customer_id: row.customer_id || null,
						};
					} catch (e) {
						return null;
					}
				})
				.filter((order) => {
					if (!order) return false;
					return order.items.some((item) => item.id === productId);
				});
			callback(null, orders);
		});
	}

	// Find orders by customer_id
	static findByCustomerId(customerId, callback) {
		const db = getDatabase();
		db.all(
			"SELECT * FROM orders WHERE customer_id = ? ORDER BY id",
			[customerId],
			(err, rows) => {
				if (err) {
					callback(err, null);
					return;
				}
				// Parse JSON items
				const orders = rows.map((row) => ({
					id: row.id,
					items: JSON.parse(row.items),
					customer_id: row.customer_id || null,
				}));
				callback(null, orders);
			}
		);
	}
}

module.exports = Order;

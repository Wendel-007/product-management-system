const { getDatabase } = require("../config/database");

class Customer {
	// Find all customers
	static findAll(callback) {
		const db = getDatabase();
		db.all("SELECT * FROM customers ORDER BY id", [], (err, rows) => {
			if (err) {
				callback(err, null);
				return;
			}
			callback(null, rows);
		});
	}

	// Find customer by ID
	static findById(id, callback) {
		const db = getDatabase();
		db.get("SELECT * FROM customers WHERE id = ?", [id], (err, row) => {
			if (err) {
				callback(err, null);
				return;
			}
			if (!row) {
				callback(null, null);
				return;
			}
			callback(null, row);
		});
	}

	// Create new customer
	static create(name, email, callback) {
		const db = getDatabase();
		db.run(
			"INSERT INTO customers (name, email) VALUES (?, ?)",
			[name, email],
			function (err) {
				if (err) {
					callback(err, null);
					return;
				}
				const customer = {
					id: this.lastID,
					name: name,
					email: email,
				};
				callback(null, customer);
			}
		);
	}

	// Update customer
	static update(id, name, email, callback) {
		const db = getDatabase();
		db.run(
			"UPDATE customers SET name = ?, email = ? WHERE id = ?",
			[name, email, id],
			(err) => {
				if (err) {
					callback(err, null);
					return;
				}
				const customer = {
					id: id,
					name: name,
					email: email,
				};
				callback(null, customer);
			}
		);
	}

	// Delete customer
	static delete(id, callback) {
		const db = getDatabase();
		db.run("DELETE FROM customers WHERE id = ?", [id], (err) => {
			if (err) {
				callback(err, false);
				return;
			}
			callback(null, true);
		});
	}
}

module.exports = Customer;

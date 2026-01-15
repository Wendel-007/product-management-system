const Customer = require("../models/Customer");
const {
	isValidString,
	isValidEmail,
	validateIdParam,
} = require("../utils/validators");

// GET /api/customer - Returns all customers
exports.getAllCustomers = (req, res) => {
	Customer.findAll((err, customers) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.status(200).json(customers);
	});
};

// GET /api/customer/:id - Returns customer by ID
exports.getCustomerById = (req, res) => {
	const id = validateIdParam(req.params.id, res);
	if (id === null) return;

	Customer.findById(id, (err, customer) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (!customer) {
			res.status(404).json({ error: "Customer not found" });
			return;
		}
		res.status(200).json(customer);
	});
};

// POST /api/customer - Adds customer
exports.createCustomer = (req, res) => {
	const { name, email } = req.body;

	if (!isValidString(name)) {
		res.status(400).json({
			error: 'Field "name" is required and must be a non-empty string',
		});
		return;
	}

	if (!isValidEmail(email)) {
		res.status(400).json({
			error: 'Field "email" is required and must have a valid format',
		});
		return;
	}

	Customer.create(name, email, (err, customer) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.status(201).json(customer);
	});
};

// PUT /api/customer/:id - Updates customer
exports.updateCustomer = (req, res) => {
	const id = validateIdParam(req.params.id, res);
	if (id === null) return;

	const { name, email } = req.body;

	Customer.findById(id, (err, existingCustomer) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (!existingCustomer) {
			res.status(404).json({ error: "Customer not found" });
			return;
		}

		const updateName = name !== undefined ? name : existingCustomer.name;
		const updateEmail = email !== undefined ? email : existingCustomer.email;

		if (name !== undefined && !isValidString(name)) {
			res.status(400).json({
				error: 'Field "name" must be a non-empty string',
			});
			return;
		}

		if (email !== undefined && !isValidEmail(email)) {
			res.status(400).json({
				error: 'Field "email" must have a valid format',
			});
			return;
		}

		Customer.update(id, updateName, updateEmail, (err, customer) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json(customer);
		});
	});
};

// DELETE /api/customer/:id - Removes customer
exports.deleteCustomer = (req, res) => {
	const id = validateIdParam(req.params.id, res);
	if (id === null) return;

	Customer.findById(id, (err, customer) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (!customer) {
			res.status(404).json({ error: "Customer not found" });
			return;
		}

		Customer.delete(id, (err, success) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json({ message: "Customer removed successfully" });
		});
	});
};

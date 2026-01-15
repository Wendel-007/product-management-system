const Order = require("../models/Order");
const Customer = require("../models/Customer");
const { isValidInteger, validateIdParam } = require("../utils/validators");

// GET /api/order - Returns all orders
exports.getAllOrders = (req, res) => {
	Order.findAll((err, orders) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.status(200).json(orders);
	});
};

// GET /api/order/:id - Returns order by ID
exports.getOrderById = (req, res) => {
	const id = validateIdParam(req.params.id, res);
	if (id === null) return;

	Order.findById(id, (err, order) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (!order) {
			res.status(404).json({ error: "Order not found" });
			return;
		}
		res.status(200).json(order);
	});
};

// POST /api/order - Adds order
exports.createOrder = (req, res) => {
	const { items, customer_id } = req.body;

	// Validations
	if (!items || !Array.isArray(items)) {
		res
			.status(400)
			.json({ error: 'Field "items" is required and must be an array' });
		return;
	}

	if (items.length === 0) {
		res.status(400).json({
			error: "An order must have at least 1 product",
		});
		return;
	}

	// Validate customer_id (required)
	if (!isValidInteger(customer_id)) {
		res.status(400).json({
			error:
				'Field "customer_id" is required and must be a positive integer',
		});
		return;
	}

	const customerId = parseInt(customer_id);

	// Validate each item in the array
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (!item.hasOwnProperty("id") || !item.hasOwnProperty("quantity")) {
			res.status(400).json({
				error: `Item at index ${i} must contain "id" and "quantity" fields`,
			});
			return;
		}

		if (!isValidInteger(item.id)) {
			res.status(400).json({
				error: `Item at index ${i}: "id" must be a positive integer`,
			});
			return;
		}

		if (!isValidInteger(item.quantity)) {
			res.status(400).json({
				error: `Item at index ${i}: "quantity" must be a positive integer`,
			});
			return;
		}

		const productId = parseInt(item.id);
		const quantity = parseInt(item.quantity);
	}

	// Check if customer exists
	Customer.findById(customerId, (err, customer) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (!customer) {
			res.status(404).json({ error: "Customer not found" });
			return;
		}

		Order.create(items, customerId, (err, order) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(201).json(order);
		});
	});
};

// PUT /api/order/:id - Updates order
exports.updateOrder = (req, res) => {
	const id = validateIdParam(req.params.id, res);
	if (id === null) return;

	const { items, customer_id } = req.body;

	// Check if order exists
	Order.findById(id, (err, existingOrder) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (!existingOrder) {
			res.status(404).json({ error: "Order not found" });
			return;
		}

		// Validate items if provided
		if (items !== undefined) {
			if (!Array.isArray(items)) {
				res.status(400).json({ error: 'Field "items" must be an array' });
				return;
			}

			if (items.length === 0) {
				res.status(400).json({
					error: "An order must have at least 1 product",
				});
				return;
			}

			// Validate each item in the array
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				if (!item.hasOwnProperty("id") || !item.hasOwnProperty("quantity")) {
					res.status(400).json({
						error: `Item at index ${i} must contain "id" and "quantity" fields`,
					});
					return;
				}

				if (!isValidInteger(item.id)) {
					res.status(400).json({
						error: `Item at index ${i}: "id" must be a positive integer`,
					});
					return;
				}

				if (!isValidInteger(item.quantity)) {
					res.status(400).json({
						error: `Item at index ${i}: "quantity" must be a positive integer`,
					});
					return;
				}

				const productId = parseInt(item.id);
				const quantity = parseInt(item.quantity);
			}
		}

		// Validate customer_id if provided (must always exist)
		let updateCustomerId = existingOrder.customer_id;
		if (customer_id !== undefined) {
			if (!isValidInteger(customer_id)) {
				res.status(400).json({
					error: 'Field "customer_id" must be a positive integer',
				});
				return;
			}
			updateCustomerId = parseInt(customer_id);
		}

		// Ensure order always has an associated customer
		if (!updateCustomerId) {
			res.status(400).json({
				error: "An order must always have an associated customer",
			});
			return;
		}

		const updateItems = items !== undefined ? items : existingOrder.items;

		// Check if customer exists (if customer_id was provided)
		if (customer_id !== undefined) {
			Customer.findById(updateCustomerId, (err, customer) => {
				if (err) {
					res.status(500).json({ error: err.message });
					return;
				}
				if (!customer) {
					res.status(404).json({ error: "Customer not found" });
					return;
				}

				Order.update(id, updateItems, updateCustomerId, (err, order) => {
					if (err) {
						res.status(500).json({ error: err.message });
						return;
					}
					res.status(200).json(order);
				});
			});
		} else {
			Order.update(id, updateItems, updateCustomerId, (err, order) => {
				if (err) {
					res.status(500).json({ error: err.message });
					return;
				}
				res.status(200).json(order);
			});
		}
	});
};

// DELETE /api/order/:id - Removes order
exports.deleteOrder = (req, res) => {
	const id = validateIdParam(req.params.id, res);
	if (id === null) return;

	// Check if order exists
	Order.findById(id, (err, order) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (!order) {
			res.status(404).json({ error: "Order not found" });
			return;
		}

		Order.delete(id, (err, success) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json({ message: "Order removed successfully" });
		});
	});
};

// GET /api/order/search - Search orders by product_id or customer_id
exports.searchOrders = (req, res) => {
	const { product_id, customer_id } = req.query;

	// Validate that at least one parameter was provided
	if (!product_id && !customer_id) {
		res
			.status(400)
			.json({ error: "Must provide product_id or customer_id" });
		return;
	}

	// Search by product_id
	if (product_id) {
		if (!isValidInteger(product_id)) {
			res.status(400).json({
				error: "product_id must be a positive integer",
			});
			return;
		}
		const productId = parseInt(product_id);

		Order.findByProductId(productId, (err, orders) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json(orders);
		});
		return;
	}

	// Search by customer_id
	if (customer_id) {
		if (!isValidInteger(customer_id)) {
			res.status(400).json({
				error: "customer_id must be a positive integer",
			});
			return;
		}
		const customerId = parseInt(customer_id);

		Order.findByCustomerId(customerId, (err, orders) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json(orders);
		});
		return;
	}
};

const Product = require("../models/Product");
const {
	isValidString,
	isValidDecimal,
	validateIdParam,
} = require("../utils/validators");

// GET /api/product - Returns all products
exports.getAllProducts = (req, res) => {
	Product.findAll((err, products) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.status(200).json(products);
	});
};

// GET /api/product/:id - Returns product by ID
exports.getProductById = (req, res) => {
	const id = validateIdParam(req.params.id, res);
	if (id === null) return;

	Product.findById(id, (err, product) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (!product) {
			res.status(404).json({ error: "Product not found" });
			return;
		}
		res.status(200).json(product);
	});
};

// POST /api/product - Adds product
exports.createProduct = (req, res) => {
	const { name, value } = req.body;

	// Validations
	if (!isValidString(name)) {
		res.status(400).json({
			error: 'Field "name" is required and must be a non-empty string',
		});
		return;
	}

	if (!isValidDecimal(value)) {
		res.status(400).json({
			error:
				'Field "value" is required and must be a number with at most two decimal places',
		});
		return;
	}

	// Ensure two decimal places
	const numValue = parseFloat(parseFloat(value).toFixed(2));

	Product.create(name, numValue, (err, product) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.status(201).json(product);
	});
};

// PUT /api/product/:id - Updates product
exports.updateProduct = (req, res) => {
	const id = validateIdParam(req.params.id, res);
	if (id === null) return;

	const { name, value } = req.body;

	// Check if product exists
	Product.findById(id, (err, existingProduct) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (!existingProduct) {
			res.status(404).json({ error: "Product not found" });
			return;
		}

		// Prepare data for update
		const updateName = name !== undefined ? name : existingProduct.name;
		let updateValue = value !== undefined ? value : existingProduct.value;

		if (name !== undefined && !isValidString(name)) {
			res.status(400).json({
				error: 'Field "name" must be a non-empty string',
			});
			return;
		}

		if (value !== undefined && !isValidDecimal(value)) {
			res.status(400).json({
				error: 'Field "value" must be a number with at most two decimal places',
			});
			return;
		}

		// Ensure two decimal places
		if (value !== undefined) {
			updateValue = parseFloat(parseFloat(value).toFixed(2));
		}

		Product.update(id, updateName, updateValue, (err, product) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json(product);
		});
	});
};

// DELETE /api/product/:id - Removes product
exports.deleteProduct = (req, res) => {
	const id = validateIdParam(req.params.id, res);
	if (id === null) return;

	// Check if product exists
	Product.findById(id, (err, product) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		if (!product) {
			res.status(404).json({ error: "Product not found" });
			return;
		}

		Product.delete(id, (err, success) => {
			if (err) {
				res.status(500).json({ error: err.message });
				return;
			}
			res.status(200).json({ message: "Product removed successfully" });
		});
	});
};

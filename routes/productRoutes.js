const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET /api/product - Returns all products
router.get("/", productController.getAllProducts);

// GET /api/product/:id - Returns product by ID
router.get("/:id", productController.getProductById);

// POST /api/product - Adds product
router.post("/", productController.createProduct);

// PUT /api/product/:id - Updates product
router.put("/:id", productController.updateProduct);

// DELETE /api/product/:id - Removes product
router.delete("/:id", productController.deleteProduct);

module.exports = router;

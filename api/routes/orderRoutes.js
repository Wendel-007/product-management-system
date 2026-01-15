const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// GET /api/order - Returns all orders
router.get("/", orderController.getAllOrders);

// GET /api/order/search - Search orders by product_id or customer_id
router.get("/search", orderController.searchOrders);

// GET /api/order/:id - Returns order by ID
router.get("/:id", orderController.getOrderById);

// POST /api/order - Adds order
router.post("/", orderController.createOrder);

// PUT /api/order/:id - Updates order
router.put("/:id", orderController.updateOrder);

// DELETE /api/order/:id - Removes order
router.delete("/:id", orderController.deleteOrder);

module.exports = router;

const express = require("express");
const productRoutes = require("./productRoutes");
const customerRoutes = require("./customerRoutes");
const orderRoutes = require("./orderRoutes");
const docsRoutes = require("./docsRoutes");

const router = express.Router();

// API Routes
router.use("/api/product", productRoutes);
router.use("/api/customer", customerRoutes);
router.use("/api/order", orderRoutes);

// Documentation Routes
router.use("/", docsRoutes);

module.exports = router;

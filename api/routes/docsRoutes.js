const express = require("express");
const path = require("path");

const router = express.Router();

/**
 * GET /docs
 * Returns ReDoc documentation page
 */
router.get("/docs", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "docs.html"));
});

/**
 * GET /login
 * Returns login page
 */
router.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "..", "web", "login.html"));
});

/**
 * GET /integration
 * Returns API integration page
 */
router.get("/integration", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "..", "web", "integration.html"));
});

/**
 * GET /
 * Redirect to login page
 */
router.get("/", (req, res) => {
	res.redirect("/login");
});

module.exports = router;

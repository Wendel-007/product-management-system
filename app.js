const express = require("express");
const path = require("path");
const { corsMiddleware } = require("./config/cors");
const { securityHeaders } = require("./config/middlewares");
const routes = require("./routes");

const app = express();

// CORS Configuration
app.use(corsMiddleware);

// Body Parser Middleware
app.use(express.json());

// Security Headers Middleware
app.use(securityHeaders);

// Static Files (for documentation)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(routes);

module.exports = app;

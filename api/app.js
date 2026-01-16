const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { corsMiddleware } = require("./config/cors");
const { securityHeaders } = require("./config/middlewares");
const routes = require("./routes");

const app = express();

// CORS Configuration
app.use(corsMiddleware);

// Body Parser Middleware
app.use(express.json());

// Cookie Parser Middleware (for JWT token in cookies)
app.use(cookieParser());

// Security Headers Middleware
app.use(securityHeaders);

// Routes (must be before static files to ensure API routes are matched first)
app.use(routes);

// Static Files (for documentation)
app.use(express.static(path.join(__dirname, "public")));

// Static Files (for web pages)
app.use(express.static(path.join(__dirname, "..", "web")));

module.exports = app;

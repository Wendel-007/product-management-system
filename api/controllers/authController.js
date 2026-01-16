const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

/**
 * GET /api/login/
 * Obtém os dados do usuário que fez a chamada caso tenha uma sessão válida
 * (usuários: 'admin' e 'user')
 */
async function getCurrentUser(req, res) {
	try {
		// User info is already attached by requireAuth middleware
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		// Return user data without password
		res.json({
			id: user.id,
			username: user.username,
			type: user.type || "user",
			created_at: user.created_at,
		});
	} catch (error) {
		console.error("Get current user error:", error);
		res.status(500).json({
			error: "Internal server error",
		});
	}
}

/**
 * GET /api/login/all
 * Obtém os dados de todos os logins
 * (somente usuário do tipo 'admin')
 */
async function getAllUsers(req, res) {
	try {
		const users = await User.findAll();
		res.json(users);
	} catch (error) {
		console.error("Get all users error:", error);
		res.status(500).json({
			error: "Internal server error",
		});
	}
}

/**
 * GET /api/login/:username
 * Obtém os dados de login do usuário com username = ':username'
 * (somente usuário do tipo 'admin')
 */
async function getUserByUsername(req, res) {
	try {
		const { username } = req.params;
		const user = await User.findByUsername(username);

		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		// Return user data without password
		res.json({
			id: user.id,
			username: user.username,
			type: user.type || "user",
			created_at: user.created_at,
		});
	} catch (error) {
		console.error("Get user by username error:", error);
		res.status(500).json({
			error: "Internal server error",
		});
	}
}

/**
 * POST /api/login
 * Recebe 'username' e 'password' e retorna o token JWT.
 * (usuários: 'todos', não há necessidade de sessão)
 */
async function login(req, res) {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				error: "Username and password are required",
			});
		}

		// Find user
		const user = await User.findByUsername(username);
		if (!user) {
			return res.status(401).json({
				error: "Invalid credentials",
			});
		}

		// Verify password
		const isValidPassword = await User.verifyPassword(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({
				error: "Invalid credentials",
			});
		}

		// Generate JWT token
		const token = generateToken({
			id: user.id,
			username: user.username,
			type: user.type || "user",
		});

		// Set token in HTTP-only cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // HTTPS only in production
			sameSite: "strict",
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		});

		// Also return token in response for clients that prefer to store it
		res.json({
			message: "Login successful",
			token: token,
			user: {
				id: user.id,
				username: user.username,
				type: user.type || "user",
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			error: "Internal server error",
		});
	}
}

/**
 * PUT /api/login/:username
 * Atualiza os dados do usuário = ':username'
 * (somente usuário do tipo 'admin')
 */
async function updateUser(req, res) {
	try {
		const { username } = req.params;
		const { password, type } = req.body;

		const updateData = {};
		if (password) updateData.password = password;
		if (type) updateData.type = type;

		if (Object.keys(updateData).length === 0) {
			return res.status(400).json({
				error: "No fields to update",
			});
		}

		const updatedUser = await User.update(username, updateData);

		res.json({
			message: "User updated successfully",
			user: {
				username: updatedUser.username,
				type: updatedUser.type,
			},
		});
	} catch (error) {
		console.error("Update user error:", error);
		if (error.message === "User not found") {
			return res.status(404).json({
				error: error.message,
			});
		}
		if (error.message.includes("Invalid user type")) {
			return res.status(400).json({
				error: error.message,
			});
		}
		res.status(500).json({
			error: "Internal server error",
		});
	}
}

/**
 * DELETE /api/login/:username
 * Apaga os dados do usuário = ':username'
 * (somente usuário do tipo 'admin')
 */
async function deleteUser(req, res) {
	try {
		const { username } = req.params;

		await User.delete(username);

		res.json({
			message: "User deleted successfully",
		});
	} catch (error) {
		console.error("Delete user error:", error);
		if (error.message === "User not found") {
			return res.status(404).json({
				error: error.message,
			});
		}
		res.status(500).json({
			error: "Internal server error",
		});
	}
}

/**
 * POST /api/login/logout
 * Logout user (clear token cookie)
 */
function logout(req, res) {
	res.clearCookie("token");
	res.json({
		message: "Logout successful",
	});
}

/**
 * GET /api/login/check
 * Check authentication status (verifica token JWT)
 */
function checkAuth(req, res) {
	try {
		const { extractToken, verifyToken } = require("../utils/jwt");
		const token = extractToken(req);

		if (!token) {
			return res.status(401).json({
				authenticated: false,
				error: "Not authenticated",
			});
		}

		// Verify token
		const decoded = verifyToken(token);

		res.json({
			authenticated: true,
			user: {
				id: decoded.id,
				username: decoded.username,
				type: decoded.type || "user",
			},
		});
	} catch (error) {
		res.status(401).json({
			authenticated: false,
			error: "Invalid or expired token",
		});
	}
}

module.exports = {
	getCurrentUser,
	getAllUsers,
	getUserByUsername,
	login,
	updateUser,
	deleteUser,
	logout,
	checkAuth,
};

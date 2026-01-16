/**
 * Authentication module
 * Handles login, logout, and authentication checks with JWT
 */

const Auth = {
	/**
	 * Get stored JWT token
	 */
	getToken() {
		// Try to get from localStorage first
		const token = localStorage.getItem("jwt_token");
		if (token) return token;
		
		// If not in localStorage, cookie will be sent automatically
		return null;
	},

	/**
	 * Store JWT token
	 */
	setToken(token) {
		if (token) {
			localStorage.setItem("jwt_token", token);
		}
	},

	/**
	 * Remove JWT token
	 */
	removeToken() {
		localStorage.removeItem("jwt_token");
	},

	/**
	 * Check if user is authenticated
	 */
	async checkAuth() {
		try {
			const token = this.getToken();
			const headers = {
				credentials: 'include'
			};

			// Add Authorization header if token exists
			if (token) {
				headers.headers = {
					'Authorization': `Bearer ${token}`
				};
			}

			const response = await fetch('/api/login/check', headers);
			
			if (response.ok) {
				const data = await response.json();
				return data;
			}
			return { authenticated: false };
		} catch (error) {
			console.error('Auth check error:', error);
			return { authenticated: false };
		}
	},

	/**
	 * Login user
	 */
	async login(username, password) {
		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ username, password }),
			});
			
			const data = await response.json();
			
			if (response.ok && data.token) {
				// Store token in localStorage for Authorization header
				this.setToken(data.token);
			}
			
			return { success: response.ok, data };
		} catch (error) {
			console.error('Login error:', error);
			return { success: false, data: { error: 'Erro de conexão. Tente novamente.' } };
		}
	},

	/**
	 * Logout user
	 */
	async logout() {
		try {
			// Remove token from localStorage
			this.removeToken();
			
			// Call logout endpoint to clear cookie
			await fetch('/api/login/logout', {
				method: 'POST',
				credentials: 'include'
			});
			return true;
		} catch (error) {
			console.error('Logout error:', error);
			return false;
		}
	}
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Auth;
}

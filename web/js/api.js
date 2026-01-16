/**
 * API utility module
 * Provides helper functions for making API calls with JWT authentication
 */

const API = {
	BASE_URL: "",

	/**
	 * Get JWT token for Authorization header
	 */
	getAuthHeader() {
		const token = localStorage.getItem("jwt_token");
		if (token) {
			return {
				Authorization: `Bearer ${token}`,
			};
		}
		return {};
	},

	/**
	 * Make an API call with JWT authentication
	 */
	async call(method, endpoint, body = null) {
		const options = {
			method,
			headers: {
				"Content-Type": "application/json",
				...this.getAuthHeader(),
			},
			credentials: "include", // Include cookies (token cookie)
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		try {
			const response = await fetch(`${this.BASE_URL}${endpoint}`, options);
			const data = await response.json();
			return { status: response.status, data };
		} catch (error) {
			return { status: 0, data: { error: error.message } };
		}
	},

	/**
	 * Display API response in the UI
	 */
	displayResponse(elementId, status, data) {
		const element = document.getElementById(elementId);
		if (!element) return;

		const statusClass = `status-${status}`;
		element.innerHTML = `
            <div class="response-header">
                <h3>Resposta</h3>
                <span class="status-badge ${statusClass}">${status}</span>
            </div>
            <div class="response-body">${JSON.stringify(data, null, 2)}</div>
        `;
	},
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
	module.exports = API;
}

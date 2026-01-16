/**
 * Customers module
 * Handles all customer-related API operations
 */

const Customers = {
	/**
	 * Get all customers
	 */
	async getAll() {
		const response = await API.call('GET', '/api/customer');
		return response;
	},

	/**
	 * Get customer by ID
	 */
	async getById(id) {
		if (!id) {
			showToast('Por favor, informe o ID do cliente', 'error');
			return;
		}
		const response = await API.call('GET', `/api/customer/${id}`);
		return response;
	},

	/**
	 * Create a new customer
	 */
	async create(name, email) {
		if (!name || !email) {
			showToast('Por favor, preencha todos os campos', 'error');
			return;
		}
		const response = await API.call('POST', '/api/customer', { name, email });
		
		if (response.status === 200 || response.status === 201) {
			showToast('Cliente criado com sucesso!', 'success');
			loadCustomers();
		} else {
			showToast(response.data.error || 'Erro ao criar cliente', 'error');
		}
		return response;
	},

	/**
	 * Update a customer
	 */
	async update(id, name, email) {
		if (!id || !name || !email) {
			showToast('Por favor, preencha todos os campos', 'error');
			return;
		}
		const response = await API.call('PUT', `/api/customer/${id}`, { name, email });
		
		if (response.status === 200) {
			showToast('Cliente atualizado com sucesso!', 'success');
			loadCustomers();
		} else {
			showToast(response.data.error || 'Erro ao atualizar cliente', 'error');
		}
		return response;
	},

	/**
	 * Delete a customer
	 */
	async delete(id) {
		if (!id) {
			showToast('Por favor, informe o ID do cliente', 'error');
			return;
		}
		const response = await API.call('DELETE', `/api/customer/${id}`);
		
		if (response.status === 200) {
			showToast('Cliente excluído com sucesso!', 'success');
			loadCustomers();
		} else {
			showToast(response.data.error || 'Erro ao excluir cliente', 'error');
		}
		return response;
	}
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Customers;
}

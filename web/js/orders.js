/**
 * Orders module
 * Handles all order-related API operations
 */

const Orders = {
	/**
	 * Get all orders
	 */
	async getAll() {
		const response = await API.call('GET', '/api/order');
		return response;
	},

	/**
	 * Get order by ID
	 */
	async getById(id) {
		if (!id) {
			showToast('Por favor, informe o ID do pedido', 'error');
			return;
		}
		const response = await API.call('GET', `/api/order/${id}`);
		return response;
	},

	/**
	 * Create a new order
	 */
	async create(itemsText, customerId) {
		if (!itemsText) {
			showToast('Por favor, informe os items do pedido', 'error');
			return;
		}
		let items;
		try {
			items = JSON.parse(itemsText);
		} catch (e) {
			showToast('Items deve ser um JSON válido', 'error');
			return;
		}
		const body = { items };
		if (customerId) {
			body.customer_id = parseInt(customerId);
		}
		const response = await API.call('POST', '/api/order', body);
		
		if (response.status === 200 || response.status === 201) {
			showToast('Pedido criado com sucesso!', 'success');
			loadOrders();
		} else {
			showToast(response.data.error || 'Erro ao criar pedido', 'error');
		}
		return response;
	},

	/**
	 * Update an order
	 */
	async update(id, itemsText, customerId) {
		if (!id || !itemsText) {
			showToast('Por favor, preencha todos os campos obrigatórios', 'error');
			return;
		}
		let items;
		try {
			items = JSON.parse(itemsText);
		} catch (e) {
			showToast('Items deve ser um JSON válido', 'error');
			return;
		}
		const body = { items };
		if (customerId) {
			body.customer_id = parseInt(customerId);
		}
		const response = await API.call('PUT', `/api/order/${id}`, body);
		
		if (response.status === 200) {
			showToast('Pedido atualizado com sucesso!', 'success');
			loadOrders();
		} else {
			showToast(response.data.error || 'Erro ao atualizar pedido', 'error');
		}
		return response;
	},

	/**
	 * Delete an order
	 */
	async delete(id) {
		if (!id) {
			showToast('Por favor, informe o ID do pedido', 'error');
			return;
		}
		const response = await API.call('DELETE', `/api/order/${id}`);
		
		if (response.status === 200) {
			showToast('Pedido excluído com sucesso!', 'success');
			loadOrders();
		} else {
			showToast(response.data.error || 'Erro ao excluir pedido', 'error');
		}
		return response;
	}
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Orders;
}

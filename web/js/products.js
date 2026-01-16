/**
 * Products module
 * Handles all product-related API operations
 */

const Products = {
	/**
	 * Get all products
	 */
	async getAll() {
		const response = await API.call('GET', '/api/product');
		return response;
	},

	/**
	 * Get product by ID
	 */
	async getById(id) {
		if (!id) {
			showToast('Por favor, informe o ID do produto', 'error');
			return;
		}
		const response = await API.call('GET', `/api/product/${id}`);
		return response;
	},

	/**
	 * Create a new product
	 */
	async create(name, value) {
		if (!name || !value) {
			showToast('Por favor, preencha todos os campos', 'error');
			return;
		}
		const response = await API.call('POST', '/api/product', { 
			name, 
			value: parseFloat(value) 
		});
		
		if (response.status === 200 || response.status === 201) {
			showToast('Produto criado com sucesso!', 'success');
			loadProducts();
		} else {
			showToast(response.data.error || 'Erro ao criar produto', 'error');
		}
		return response;
	},

	/**
	 * Update a product
	 */
	async update(id, name, value) {
		if (!id || !name || !value) {
			showToast('Por favor, preencha todos os campos', 'error');
			return;
		}
		const response = await API.call('PUT', `/api/product/${id}`, { 
			name, 
			value: parseFloat(value) 
		});
		
		if (response.status === 200) {
			showToast('Produto atualizado com sucesso!', 'success');
			loadProducts();
		} else {
			showToast(response.data.error || 'Erro ao atualizar produto', 'error');
		}
		return response;
	},

	/**
	 * Delete a product
	 */
	async delete(id) {
		if (!id) {
			showToast('Por favor, informe o ID do produto', 'error');
			return;
		}
		const response = await API.call('DELETE', `/api/product/${id}`);
		
		if (response.status === 200) {
			showToast('Produto excluído com sucesso!', 'success');
			loadProducts();
		} else {
			showToast(response.data.error || 'Erro ao excluir produto', 'error');
		}
		return response;
	}
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Products;
}

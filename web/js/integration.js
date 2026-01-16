/**
 * Integration page controller
 * Manages the system interface with tables and modals
 */

// Tab switching
function switchTab(tabName) {
	document
		.querySelectorAll(".tab")
		.forEach((tab) => tab.classList.remove("active"));
	document
		.querySelectorAll(".tab-content")
		.forEach((content) => content.classList.remove("active"));

	event.target.classList.add("active");
	document.getElementById(tabName).classList.add("active");

	// Load data when switching tabs
	if (tabName === "products") {
		loadProducts();
	} else if (tabName === "customers") {
		loadCustomers();
	} else if (tabName === "orders") {
		loadOrders();
	}
}

// Logout function
async function logout() {
	await Auth.logout();
	window.location.href = "/login.html";
}

// Toast notification (global function)
window.showToast = function (message, type = "info") {
	const toast = document.getElementById("toast");
	toast.textContent = message;
	toast.className = `toast ${type} show`;

	setTimeout(() => {
		toast.classList.remove("show");
	}, 3000);
};

// Product Modal Functions
function openProductModal(product = null) {
	const modal = document.getElementById("productModal");
	const form = document.getElementById("productForm");
	const title = document.getElementById("productModalTitle");

	if (product) {
		title.textContent = "Editar Produto";
		document.getElementById("product-id").value = product.id;
		document.getElementById("product-name").value = product.name;
		document.getElementById("product-value").value = product.value;
	} else {
		title.textContent = "Novo Produto";
		form.reset();
		document.getElementById("product-id").value = "";
	}

	modal.classList.add("show");
}

function closeProductModal() {
	document.getElementById("productModal").classList.remove("show");
}

async function handleProductSubmit(event) {
	event.preventDefault();

	const id = document.getElementById("product-id").value;
	const name = document.getElementById("product-name").value;
	const value = document.getElementById("product-value").value;

	if (id) {
		await Products.update(id, name, value);
	} else {
		await Products.create(name, value);
	}

	closeProductModal();
}

// Customer Modal Functions
function openCustomerModal(customer = null) {
	const modal = document.getElementById("customerModal");
	const form = document.getElementById("customerForm");
	const title = document.getElementById("customerModalTitle");

	if (customer) {
		title.textContent = "Editar Cliente";
		document.getElementById("customer-id").value = customer.id;
		document.getElementById("customer-name").value = customer.name;
		document.getElementById("customer-email").value = customer.email;
	} else {
		title.textContent = "Novo Cliente";
		form.reset();
		document.getElementById("customer-id").value = "";
	}

	modal.classList.add("show");
}

function closeCustomerModal() {
	document.getElementById("customerModal").classList.remove("show");
}

async function handleCustomerSubmit(event) {
	event.preventDefault();

	const id = document.getElementById("customer-id").value;
	const name = document.getElementById("customer-name").value;
	const email = document.getElementById("customer-email").value;

	if (id) {
		await Customers.update(id, name, email);
	} else {
		await Customers.create(name, email);
	}

	closeCustomerModal();
}

// Order Modal Functions
function openOrderModal(order = null) {
	const modal = document.getElementById("orderModal");
	const form = document.getElementById("orderForm");
	const title = document.getElementById("orderModalTitle");

	if (order) {
		title.textContent = "Editar Pedido";
		document.getElementById("order-id").value = order.id;
		document.getElementById("order-customer-id").value =
			order.customer_id || "";
		document.getElementById("order-items").value = JSON.stringify(
			order.items,
			null,
			2
		);
	} else {
		title.textContent = "Novo Pedido";
		form.reset();
		document.getElementById("order-id").value = "";
	}

	modal.classList.add("show");
}

function closeOrderModal() {
	document.getElementById("orderModal").classList.remove("show");
}

async function handleOrderSubmit(event) {
	event.preventDefault();

	const id = document.getElementById("order-id").value;
	const itemsText = document.getElementById("order-items").value;
	const customerId = document.getElementById("order-customer-id").value;

	if (id) {
		await Orders.update(id, itemsText, customerId);
	} else {
		await Orders.create(itemsText, customerId);
	}

	closeOrderModal();
}

// Load and render functions (global)
window.loadProducts = async function () {
	const tbody = document.getElementById("products-table-body");
	tbody.innerHTML =
		'<tr><td colspan="4" class="loading-row"><span class="loading"></span> Carregando produtos...</td></tr>';

	const response = await Products.getAll();
	if (response.status === 200 && response.data) {
		renderProductsTable(response.data);
	} else {
		tbody.innerHTML =
			'<tr><td colspan="4" style="text-align: center; padding: 40px; color: #999;">Nenhum produto encontrado</td></tr>';
	}
};

function renderProductsTable(products) {
	const tbody = document.getElementById("products-table-body");

	if (!products || products.length === 0) {
		tbody.innerHTML =
			'<tr><td colspan="4" style="text-align: center; padding: 40px; color: #999;">Nenhum produto cadastrado</td></tr>';
		return;
	}

	tbody.innerHTML = products
		.map(
			(product, index) => `
		<tr>
			<td>${product.id}</td>
			<td><strong>${product.name}</strong></td>
			<td>R$ ${parseFloat(product.value).toFixed(2).replace(".", ",")}</td>
			<td>
				<div class="action-buttons">
					<button class="btn-edit" onclick="editProduct(${index})">
						Editar
					</button>
					<button class="btn-danger" onclick="deleteProduct(${product.id})">
						Excluir
					</button>
				</div>
			</td>
		</tr>
	`
		)
		.join("");

	// Store products for editing
	window.productsData = products;
}

function editProduct(index) {
	openProductModal(window.productsData[index]);
}

window.deleteProduct = async function (id) {
	if (!confirm("Tem certeza que deseja excluir este produto?")) {
		return;
	}
	await Products.delete(id);
};

window.loadCustomers = async function () {
	const tbody = document.getElementById("customers-table-body");
	tbody.innerHTML =
		'<tr><td colspan="4" class="loading-row"><span class="loading"></span> Carregando clientes...</td></tr>';

	const response = await Customers.getAll();
	if (response.status === 200 && response.data) {
		renderCustomersTable(response.data);
	} else {
		tbody.innerHTML =
			'<tr><td colspan="4" style="text-align: center; padding: 40px; color: #999;">Nenhum cliente encontrado</td></tr>';
	}
};

function renderCustomersTable(customers) {
	const tbody = document.getElementById("customers-table-body");

	if (!customers || customers.length === 0) {
		tbody.innerHTML =
			'<tr><td colspan="4" style="text-align: center; padding: 40px; color: #999;">Nenhum cliente cadastrado</td></tr>';
		return;
	}

	tbody.innerHTML = customers
		.map(
			(customer, index) => `
		<tr>
			<td>${customer.id}</td>
			<td><strong>${customer.name}</strong></td>
			<td>${customer.email}</td>
			<td>
				<div class="action-buttons">
					<button class="btn-edit" onclick="editCustomer(${index})">
						Editar
					</button>
					<button class="btn-danger" onclick="deleteCustomer(${customer.id})">
						Excluir
					</button>
				</div>
			</td>
		</tr>
	`
		)
		.join("");

	// Store customers for editing
	window.customersData = customers;
}

function editCustomer(index) {
	openCustomerModal(window.customersData[index]);
}

window.deleteCustomer = async function (id) {
	if (!confirm("Tem certeza que deseja excluir este cliente?")) {
		return;
	}
	await Customers.delete(id);
};

window.loadOrders = async function () {
	const tbody = document.getElementById("orders-table-body");
	tbody.innerHTML =
		'<tr><td colspan="6" class="loading-row"><span class="loading"></span> Carregando pedidos...</td></tr>';

	const response = await Orders.getAll();
	if (response.status === 200 && response.data) {
		renderOrdersTable(response.data);
	} else {
		tbody.innerHTML =
			'<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">Nenhum pedido encontrado</td></tr>';
	}
};

function renderOrdersTable(orders) {
	const tbody = document.getElementById("orders-table-body");

	if (!orders || orders.length === 0) {
		tbody.innerHTML =
			'<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">Nenhum pedido cadastrado</td></tr>';
		return;
	}

	tbody.innerHTML = orders
		.map((order, index) => {
			const itemsCount = order.items ? order.items.length : 0;
			const total = order.items
				? order.items.reduce((sum, item) => {
						return sum + (item.product_value || 0) * (item.quantity || 0);
				  }, 0)
				: 0;
			const date = order.created_at
				? new Date(order.created_at).toLocaleDateString("pt-BR")
				: "-";

			return `
			<tr>
				<td>${order.id}</td>
				<td>${order.customer_name || "Sem cliente"}</td>
				<td>${itemsCount} item(ns)</td>
				<td><strong>R$ ${total.toFixed(2).replace(".", ",")}</strong></td>
				<td>${date}</td>
				<td>
					<div class="action-buttons">
						<button class="btn-edit" onclick="editOrder(${index})">
							Editar
						</button>
						<button class="btn-danger" onclick="deleteOrder(${order.id})">
							Excluir
						</button>
					</div>
				</td>
			</tr>
		`;
		})
		.join("");

	// Store orders for editing
	window.ordersData = orders;
}

function editOrder(index) {
	openOrderModal(window.ordersData[index]);
}

window.deleteOrder = async function (id) {
	if (!confirm("Tem certeza que deseja excluir este pedido?")) {
		return;
	}
	await Orders.delete(id);
};

// Close modals when clicking outside
window.onclick = function (event) {
	const productModal = document.getElementById("productModal");
	const customerModal = document.getElementById("customerModal");
	const orderModal = document.getElementById("orderModal");

	if (event.target === productModal) {
		closeProductModal();
	}
	if (event.target === customerModal) {
		closeCustomerModal();
	}
	if (event.target === orderModal) {
		closeOrderModal();
	}
};

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
	// Check authentication
	const authData = await Auth.checkAuth();

	if (authData.authenticated) {
		document.getElementById("userName").textContent = authData.user.username;
		// Load initial data
		loadProducts();
	} else {
		window.location.href = "/login.html";
	}
});

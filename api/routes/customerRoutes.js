const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { requireAuth } = require('../middlewares/authMiddleware');

// All customer routes require authentication
router.use(requireAuth);

// GET /api/customer - Returns all customers
router.get('/', customerController.getAllCustomers);

// GET /api/customer/:id - Returns customer by ID
router.get('/:id', customerController.getCustomerById);

// POST /api/customer - Adds customer
router.post('/', customerController.createCustomer);

// PUT /api/customer/:id - Updates customer
router.put('/:id', customerController.updateCustomer);

// DELETE /api/customer/:id - Removes customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;


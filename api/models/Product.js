const { getDatabase } = require('../config/database');

class Product {
  // Find all products
  static findAll(callback) {
    const db = getDatabase();
    db.all('SELECT * FROM products ORDER BY id', [], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      // Format value with two decimal places
      const products = rows.map(row => ({
        id: row.id,
        name: row.name,
        value: parseFloat(row.value.toFixed(2))
      }));
      callback(null, products);
    });
  }

  // Find product by ID
  static findById(id, callback) {
    const db = getDatabase();
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) {
        callback(err, null);
        return;
      }
      if (!row) {
        callback(null, null);
        return;
      }
      // Format value with two decimal places
      const product = {
        id: row.id,
        name: row.name,
        value: parseFloat(row.value.toFixed(2))
      };
      callback(null, product);
    });
  }

  // Create new product
  static create(name, value, callback) {
    const db = getDatabase();
    const numValue = parseFloat(value);
    
    db.run('INSERT INTO products (name, value) VALUES (?, ?)', 
      [name, numValue], function(err) {
      if (err) {
        callback(err, null);
        return;
      }
      const product = {
        id: this.lastID,
        name: name,
        value: parseFloat(numValue.toFixed(2))
      };
      callback(null, product);
    });
  }

  // Update product
  static update(id, name, value, callback) {
    const db = getDatabase();
    const numValue = parseFloat(value);
    
    db.run('UPDATE products SET name = ?, value = ? WHERE id = ?', 
      [name, numValue, id], (err) => {
      if (err) {
        callback(err, null);
        return;
      }
      const product = {
        id: id,
        name: name,
        value: parseFloat(numValue.toFixed(2))
      };
      callback(null, product);
    });
  }

  // Delete product
  static delete(id, callback) {
    const db = getDatabase();
    db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
      if (err) {
        callback(err, false);
        return;
      }
      callback(null, true);
    });
  }
}

module.exports = Product;


const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productName TEXT,
        productType TEXT,
        targetMarket TEXT,
        ingredients TEXT,
        intendedUse TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.log("Table already exists or error: ", err);
        }
    });
  }
});

// Mock Analysis logic to replace the hardcoded response
const getAnalysis = (productType) => {
    return {
      classification: "Ayurvedic Proprietary Medicine",
      confidence: "HIGH",
      pathways: {
        ip: ["Patent Check Required", "Trademark Class 5"],
        abs: ["NBA Form 1 Triggered"],
        regulatory: ["AYUSH License Required"]
      }
    };
};

// CRUD Endpoints

// 1. Create a Product
app.post('/api/products', (req, res) => {
  const { productName, productType, targetMarket, ingredients, intendedUse } = req.body;
  const insert = 'INSERT INTO products (productName, productType, targetMarket, ingredients, intendedUse) VALUES (?,?,?,?,?)';
  db.run(insert, [productName, productType, targetMarket, ingredients, intendedUse], function(err) {
      if (err) {
          res.status(400).json({"error": err.message});
          return;
      }
      res.json({
          "message": "success",
          "data": { id: this.lastID, productName, productType, targetMarket, ingredients, intendedUse }
      });
  });
});

// 2. Read all Products
app.get('/api/products', (req, res) => {
  const sql = "SELECT * FROM products ORDER BY createdAt DESC";
  db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message": "success",
          "data": rows
      });
  });
});

// 3. Read single product
app.get('/api/products/:id', (req, res) => {
  const sql = "SELECT * FROM products WHERE id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message": "success",
          "data": row
      });
  });
});

// 4. Update Product
app.put('/api/products/:id', (req, res) => {
    const { productName, productType, targetMarket, ingredients, intendedUse } = req.body;
    db.run(
        `UPDATE products set productName = ?, productType = ?, targetMarket = ?, ingredients = ?, intendedUse = ? WHERE id = ?`,
        [productName, productType, targetMarket, ingredients, intendedUse, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message});
                return;
            }
            res.json({
                message: "success",
                changes: this.changes
            });
    });
});

// 5. Delete Product
app.delete('/api/products/:id', (req, res) => {
    db.run(
        'DELETE FROM products WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({"error": err.message});
                return;
            }
            res.json({"message":"deleted", changes: this.changes});
    });
});

// 6. Get Product Analysis
app.get('/api/products/:id/analysis', (req, res) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err || !row) {
          res.status(404).json({"error": "Product not found"});
          return;
        }
        res.json({
            "message": "success",
            "product": row,
            "analysis": getAnalysis(row.productType)
        });
    });
});

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});

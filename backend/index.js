require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize MongoDB (Serverless-safe connection)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ojasbaitulebusiness01_db_user:4gO1POSA8d9AL5sY@cluster0.mltejdz.mongodb.net/sih?retryWrites=true&w=majority&appName=Cluster0";

// Serverless Middleware: Ensure DB is connected before handling any route
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        try {
            await mongoose.connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log("Connected to MongoDB for Serverless execution.");
        } catch (err) {
            console.error("MongoDB connection error:", err);
            return res.status(500).json({ error: "Database connection failed" });
        }
    }
    next();
});

// Define Product Schema
const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productType: { type: String, required: true },
    targetMarket: { type: String, required: true },
    ingredients: { type: String },
    intendedUse: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Mock Analysis logic
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
app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json({ message: "success", data: product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 2. Read all Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ message: "success", data: products });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. Read single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "success", data: product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. Update Product
app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "success", data: product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. Delete Product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 6. Get Product Analysis
app.get('/api/products/:id/analysis', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        
        res.json({
            message: "success",
            product: product,
            analysis: getAnalysis(product.productType)
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 7. Chatbot Endpoint with Free Search (Wikipedia API)
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    
    try {
        const products = await Product.find();
        const total = products.length;
        const productsNames = products.map(r => r.productName).join(", ");
        
        let reply = "";
        
        if (userMessage.includes('how many') || userMessage.includes('total')) {
            reply = `You currently have ${total} products in your inventory.`;
            return res.json({ reply });
        } else if (userMessage.includes('what') && userMessage.includes('products')) {
            reply = `Your products are: ${productsNames || 'None currently'}.`;
            return res.json({ reply });
        } else if (userMessage.includes('ip') || userMessage.includes('patent')) {
            reply = "Based on Ayurvedic guidelines, polyherbal formulations may be patentable if they show synergistic novelty over traditional knowledge. Have you checked the TKDL yet?";
            return res.json({ reply });
        } else {
            // Free Search Engine Integration (Wikipedia API)
            try {
                const query = req.body.message.replace(/what is|tell me about/ig, '').trim();
                const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
                if (wikiRes.ok) {
                    const wikiData = await wikiRes.json();
                    if (wikiData.extract) {
                        reply = `Here is what I found from the web: ${wikiData.extract}`;
                        return res.json({ reply });
                    }
                }
                reply = `That's an interesting question about your ${total} products. Since I'm running in demo mode, I can tell you that you've built a fantastic IP portfolio! (I also tried searching the web for '${query}' but couldn't find a quick summary).`;
                return res.json({ reply });
            } catch (e) {
                reply = `That's an interesting question about your ${total} products. I tried to search the web but encountered an error.`;
                return res.json({ reply });
            }
        }
    } catch (err) {
        res.status(500).json({ reply: "Database error." });
    }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
  });
}

module.exports = app;

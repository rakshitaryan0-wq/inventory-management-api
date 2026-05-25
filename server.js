const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory database for the Inventory Management App
let inventory = [
    { id: "1", name: "Wireless Mouse", category: "Electronics", quantity: 50, price: 25.99 },
    { id: "2", name: "Desk Lamp", category: "Office Supplies", quantity: 12, price: 34.50 }
];

// ---------------------------------------------------------
// ROUTES (CRUD Operations)
// ---------------------------------------------------------

// 1. READ ALL: Get all items
app.get('/api/items', (req, res) => {
    res.status(200).json(inventory);
});

// 2. READ ONE: Get a single item by ID
app.get('/api/items/:id', (req, res) => {
    const item = inventory.find(i => i.id === req.params.id);
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
});

// 3. CREATE: Add a new item
app.post('/api/items', (req, res) => {
    const { name, category, quantity, price } = req.body;

    // Basic validation
    if (!name || !category || quantity == null || price == null) {
        return res.status(400).json({ error: "Missing required fields (name, category, quantity, price)" });
    }

    const newItem = {
        id: Date.now().toString(), // Simple unique ID generation
        name,
        category,
        quantity,
        price
    };

    inventory.push(newItem);
    res.status(201).json(newItem);
});

// 4. UPDATE: Modify an existing item
app.put('/api/items/:id', (req, res) => {
    const itemIndex = inventory.findIndex(i => i.id === req.params.id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
    }

    const { name, category, quantity, price } = req.body;

    // Update only the provided fields
    const updatedItem = {
        ...inventory[itemIndex],
        name: name !== undefined ? name : inventory[itemIndex].name,
        category: category !== undefined ? category : inventory[itemIndex].category,
        quantity: quantity !== undefined ? quantity : inventory[itemIndex].quantity,
        price: price !== undefined ? price : inventory[itemIndex].price,
    };

    inventory[itemIndex] = updatedItem;
    res.status(200).json(updatedItem);
});

// 5. DELETE: Remove an item
app.delete('/api/items/:id', (req, res) => {
    const itemIndex = inventory.findIndex(i => i.id === req.params.id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
    }

    inventory.splice(itemIndex, 1);
    res.status(204).send(); // 204 No Content
});

// ---------------------------------------------------------
// SERVER INITIALIZATION
// ---------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Inventory Management App API is running on http://localhost:${PORT}`);
});
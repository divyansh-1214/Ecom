const express = require("express")
const app = express();
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const port = process.env.PORT || 3000; // Provide a default port
const db = process.env.MONGO_URI;
if (!db) {
    console.error("MONGO_URI environment variable is not set.");
    process.exit(1);
}
const mongoose = require('mongoose');

app.use(cors({
    origin: ['http://localhost:5173'], // your React app
    credentials: true
}));
app.use(express.json())
app.use('/', require('./routes/routes'))
app.use('/user', require('./routes/userRoutes'))
app.use('/product', require('./routes/productRoutes'))
app.use('/cart', require('./routes/cartRoutes'))


mongoose.connect(db)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    })
console.log("MONGO_URI:", process.env.MONGO_URI);
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());

// Connect Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));

app.get('/', (req, res) => res.send('LinkHub API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
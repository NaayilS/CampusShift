const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');

dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // To parse incoming JSON data
app.use(cors()); // To enable Cross-Origin Resource Sharing (CORS)

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Simple test route
app.get('/', (req, res) => {
    res.send('CampusShift Backend API');
});

// Routes
app.use('/api/auth', authRoutes); // Register and Login routes

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

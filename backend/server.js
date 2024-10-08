import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import collegeRoutes from './routes/college.js'; 

dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); 
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
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
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/colleges', collegeRoutes); // College routes

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong! Please try again later.' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const connectDB = require('./config/db');
const securityMiddleware = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;

// Apply security middleware first
securityMiddleware(app);

// Body parser middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const travelRoutes = require('./routes/travelRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/travels', travelRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
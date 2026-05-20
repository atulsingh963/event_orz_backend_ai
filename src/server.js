require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const venueRoutes = require('./routes/venueRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const talentRoutes = require('./routes/talentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
const allowedOrigins = [
  'https://event-orz-frontend.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, etc.)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) ||
                      origin.endsWith('.vercel.app') ||
                      /^http:\/\/localhost:\d+$/.test(origin);
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Warning] Origin "${origin}" is not allowed by CORS whitelist.`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight OPTIONS requests for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check and Root route
app.get('/', (req, res) => {
  res.send('<h1>EventOrz API is Running! 🚀</h1><p>This is the backend API. Please visit <a href="http://localhost:3000">http://localhost:3000</a> to view the Frontend UI.</p>');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Event Organizer API is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Export the Express API for Vercel
module.exports = app;

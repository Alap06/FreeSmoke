require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const connectDB = require('./config/db');

connectDB();

const app = express();

// Security and CORS
app.use(helmet());
app.use(cors({
  origin: '*', // For development with Expo tunnel/LAN
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

// Health check and root
app.get('/', (req, res) => {
  res.json({ message: '🚭 FreeSmoke API is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur lancé sur http://${HOST}:${PORT}`);
});
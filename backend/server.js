const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// 1. IMPORT ACTIVE ROUTE MODULES
// ==========================================
const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const gameRoutes = require('./routes/gameRoutes');
// NOTE: statisticsRoutes is deliberately excluded here to prevent errors

// ==========================================
// 2. MOUNT ACTIVE ROUTE PIPELINES
// ==========================================
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes); // Links your Players interface endpoint
app.use('/api/games', gameRoutes);

// Base Check Route
app.get('/', (req, res) => {
    res.send('Baseball Management API is running smoothly!');
});

// Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});
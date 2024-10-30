require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cors = require('cors');
const path = require('path');
const connectDB = require('../config/database');
const tripController = require('../controllers/tripController');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/trips', tripController.createTrip);
app.get('/api/trips', tripController.getTrips);
app.get('/api/trips/:id', tripController.getTripById);
app.put('/api/trips/:id/name', tripController.updateTripName);
app.delete('/api/trips/:id', tripController.deleteTrip);
app.put('/api/trips/:id/packing', tripController.updatePackingList);
app.put('/api/trips/:id/checklist', tripController.updateChecklist);
app.put('/api/trips/:id/shopping', tripController.updateShoppingList);
app.put('/api/trips/:id/expenses', tripController.updateExpenses);
app.put('/api/trips/:id/itinerary', tripController.updateItinerary);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

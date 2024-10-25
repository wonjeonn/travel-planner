require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
})();

const itinerarySchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, required: true }
});

const tripSchema = new mongoose.Schema({
    name: { type: String, required: true },
    packingList: [String],
    checklist: [String],
    shoppingList: [String],
    expenses: [{ text: String, amount: Number }],
    itinerary: [itinerarySchema]
});

const Trip = mongoose.model('Trip', tripSchema);

app.post('/api/trips', async (req, res) => {
    const { name, packingList, checklist, shoppingList, expenses, itinerary } = req.body;
    const transformedItinerary = itinerary.map(item => ({
        type: item.type,
        name: item.name,
        date: new Date(item.date),
        status: item.status
    }));

    try {
        const newTrip = new Trip({
            name,
            packingList,
            checklist,
            shoppingList,
            expenses,
            itinerary: transformedItinerary
        });

        await newTrip.save();
        res.status(201).json({ message: 'trip created successfully!', trip: newTrip });
    } catch (error) {
        console.error("error saving trip:", error);
        res.status(500).json({ message: 'error creating trip', error });
    }
});

app.get('/api/trips', async (req, res) => {
    try {
        const trips = await Trip.find();
        res.status(200).json(trips);
    } catch (error) {
        console.error('error fetching trips:', error);
        res.status(500).json({ message: 'error fetching trips', error });
    }
});

app.get('/api/trips/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: 'trip not found' });
        }
        res.status(200).json(trip);
    } catch (error) {
        console.error('error fetching trip:', error);
        res.status(500).json({ message: 'error fetching trip details', error });
    }
});

app.delete('/api/trips/:id', async (req, res) => {
    try {
        const tripId = req.params.id;
        const deletedTrip = await Trip.findByIdAndDelete(tripId);

        if (!deletedTrip) {
            return res.status(404).json({ message: 'trip not found' });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('error deleting trip:', error);
        res.status(500).json({ message: 'error deleting trip', error });
    }
});

app.put('/api/trips/:id/packing', async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { packingList: req.body.packingList },
            { new: true, runValidators: true }
        );
        if (!trip) {
            return res.status(404).json({ message: 'trip not found' });
        }
        res.status(200).json(trip);
    } catch (error) {
        console.error('error updating packing list:', error);
        res.status(500).json({ message: 'error updating packing list', error });
    }
});

app.put('/api/trips/:id/checklist', async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { checklist: req.body.checklist },
            { new: true, runValidators: true }
        );
        if (!trip) {
            return res.status(404).json({ message: 'trip not found' });
        }
        res.status(200).json(trip);
    } catch (error) {
        console.error('error updating checklist:', error);
        res.status(500).json({ message: 'error updating checklist', error });
    }
});

app.put('/api/trips/:id/shopping', async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { shoppingList: req.body.shoppingList },
            { new: true, runValidators: true }
        );
        if (!trip) {
            return res.status(404).json({ message: 'trip not found' });
        }
        res.status(200).json(trip);
    } catch (error) {
        console.error('error updating shopping list:', error);
        res.status(500).json({ message: 'error updating shopping list', error });
    }
});

app.put('/api/trips/:id/expenses', async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { expenses: req.body.expenses },
            { new: true, runValidators: true }
        );
        if (!trip) {
            return res.status(404).json({ message: 'trip not found' });
        }
        res.status(200).json(trip);
    } catch (error) {
        console.error('error updating trip expenses:', error);
        res.status(500).json({ message: 'error updating trip expenses', error });
    }
});

app.put('/api/trips/:id/itinerary', async (req, res) => {
    const { itinerary } = req.body;

    try {
        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.id,
            { itinerary },
            { new: true, runValidators: true }
        );

        if (!updatedTrip) {
            return res.status(404).json({ message: 'trip not found' });
        }
        res.status(200).json(updatedTrip);
    } catch (error) {
        console.error('error updating itinerary:', error);
        res.status(500).json({ message: 'error updating itinerary', error });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
    console.error('error:', err);
    res.status(500).json({ message: 'internal server error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

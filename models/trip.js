const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
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
module.exports = Trip;

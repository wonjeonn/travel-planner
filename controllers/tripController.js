const Trip = require('../models/trip');

const createTrip = async (req, res) => {
    const { name, packingList, checklist, shoppingList, expenses, itinerary } = req.body;

    const transformedItinerary = itinerary.map(item => ({
        type: item.type,
        name: item.name,
        date: new Date(item.date),
        time: item.time,
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
};

const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find();
        res.status(200).json(trips);
    } catch (error) {
        console.error('error fetching trips:', error);
        res.status(500).json({ message: 'error fetching trips', error });
    }
};

const getTripById = async (req, res) => {
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
};

const updateTripName = async (req, res) => {
    const { name } = req.body;

    try {
        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedTrip) {
            return res.status(404).json({ message: 'trip not found' });
        }
        res.status(200).json(updatedTrip);
    } catch (error) {
        console.error('error updating trip name:', error);
        res.status(500).json({ message: 'error updating trip name', error });
    }
};

const deleteTrip = async (req, res) => {
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
};

const updatePackingList = async (req, res) => {
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
};

const updateChecklist = async (req, res) => {
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
};

const updateShoppingList = async (req, res) => {
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
};

const updateExpenses = async (req, res) => {
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
};

const updateItinerary = async (req, res) => {
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
};

module.exports = {
    createTrip,
    getTrips,
    getTripById,
    updateTripName,
    deleteTrip,
    updatePackingList,
    updateChecklist,
    updateShoppingList,
    updateExpenses,
    updateItinerary
};

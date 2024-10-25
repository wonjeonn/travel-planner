const tripForm = document.getElementById('trip-form');
const tripList = document.getElementById('trip-list');

const loadTrips = async () => {
    try {
        const res = await fetch('/api/trips');
        const trips = await res.json();
        tripList.innerHTML = '';

        trips.forEach(trip => {
            const tripElement = document.createElement('div');

            const link = document.createElement('a');
            link.href = `trip.html?id=${trip._id}`;
            link.textContent = trip.name;
            link.style.marginLeft = '10px';

            tripElement.appendChild(link);
            tripList.appendChild(tripElement);
        });
    } catch (error) {
        console.error('error loading trips:', error);
    }
};

tripForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tripName = document.getElementById('trip-name').value.trim();

    if (tripName) {
        try {
            const res = await fetch('/api/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: tripName,
                    packingList: [], 
                    checklist: [], 
                    shoppingList: [], 
                    expenses: [], 
                    itinerary: [] 
                })
            });

            if (res.ok) {
                loadTrips();
                tripForm.reset();
            } else {
                console.error('error creating trip:', res.statusText);
            }
        } catch (error) {
            console.error('error submitting form:', error);
        }
    }
});

window.onload = loadTrips;

const getQueryParameter = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const tripId = getQueryParameter('id');
if (tripId) {
    document.getElementById('trip-title').textContent = tripId;
}

const createListItem = (itemText, section, saveFunction) => {
    const itemDiv = document.createElement('div');
    itemDiv.textContent = itemText;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'remove';
    removeButton.onclick = async () => {
        itemDiv.remove();
        await saveFunction();
    };
    itemDiv.appendChild(removeButton);
    return itemDiv;
};

const createExpenseItem = (text, amount, saveFunction) => {
    const expenseDiv = document.createElement('div');
    expenseDiv.textContent = `${text}: $${amount}`;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'remove';
    removeButton.onclick = async () => {
        expenseDiv.remove();
        await saveFunction();
    };
    expenseDiv.appendChild(removeButton);
    return expenseDiv;
};

const createItineraryRow = (type, name, date, status, saveFunction) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${type}</td><td>${name}</td><td>${date}</td><td>${status}</td>`;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'remove';
    removeButton.onclick = async () => {
        row.remove();
        await saveFunction();
    };
    const actionCell = document.createElement('td');
    actionCell.appendChild(removeButton);
    row.appendChild(actionCell);
    return row;
};

const loadTripDetails = async () => {
    if (!tripId) return;

    try {
        const res = await fetch(`/api/trips/${tripId}`);
        if (res.ok) {
            const trip = await res.json();

            const packingBoxes = document.getElementById('packing-boxes');
            packingBoxes.innerHTML = '';
            trip.packingList.forEach(item => {
                const packingBox = createListItem(item, 'packing', () => savePackingList(tripId));
                packingBoxes.appendChild(packingBox);
            });

            const todoBoxes = document.getElementById('checklist-boxes');
            todoBoxes.innerHTML = '';
            trip.checklist.forEach(item => {
                const checklistBox = createListItem(item, 'checklist', () => saveChecklist(tripId));
                todoBoxes.appendChild(checklistBox);
            });

            const shoppingBoxes = document.getElementById('shopping-boxes');
            shoppingBoxes.innerHTML = '';
            trip.shoppingList.forEach(item => {
                const shoppingBox = createListItem(item, 'shopping', () => saveShoppingList(tripId));
                shoppingBoxes.appendChild(shoppingBox);
            });

            const expenseBoxes = document.getElementById('expense-boxes');
            const totalExpensesDisplay = document.getElementById('total-expenses');
            let totalExpenses = 0;
            expenseBoxes.innerHTML = '';
            trip.expenses.forEach(expense => {
                const expenseBox = createExpenseItem(expense.text, expense.amount, () => saveExpenses(tripId));
                expenseBoxes.appendChild(expenseBox);
                totalExpenses += expense.amount;
            });
            totalExpensesDisplay.textContent = totalExpenses.toFixed(2);

            const itineraryTableBody = document.getElementById('itinerary-body');
            itineraryTableBody.innerHTML = '';
            trip.itinerary.forEach(item => {
                const row = createItineraryRow(item.type, item.name, item.date, item.status, () => saveItinerary(tripId));
                itineraryTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('error fetching trip details:', error);
    }
};

const savePackingList = async (tripId) => {
    const packingItems = Array.from(document.querySelectorAll('#packing-boxes > div')).map(item => item.firstChild.textContent);
    await fetch(`/api/trips/${tripId}/packing`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packingList: packingItems }),
    });
};

const saveChecklist = async (tripId) => {
    const checklistItems = Array.from(document.querySelectorAll('#checklist-boxes > div')).map(item => item.firstChild.textContent);
    await fetch(`/api/trips/${tripId}/checklist`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklist: checklistItems }),
    });
};

const saveShoppingList = async (tripId) => {
    const shoppingItems = Array.from(document.querySelectorAll('#shopping-boxes > div')).map(item => item.firstChild.textContent);
    await fetch(`/api/trips/${tripId}/shopping`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shoppingList: shoppingItems }),
    });
};

const saveExpenses = async (tripId) => {
    const expenseItems = Array.from(document.querySelectorAll('#expense-boxes > div')).map(item => {
        const text = item.textContent.split(': $')[0];
        const amount = parseFloat(item.textContent.split(': $')[1]);
        return { text, amount };
    });
    await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses: expenseItems }),
    });
};

const saveItinerary = async (tripId) => {
    const itineraryItems = Array.from(document.querySelectorAll('#itinerary-body tr')).map(row => {
        const cells = row.children;
        return {
            type: cells[0].textContent,
            name: cells[1].textContent,
            date: cells[2].textContent,
            status: cells[3].textContent,
        };
    });
    await fetch(`/api/trips/${tripId}/itinerary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: itineraryItems }),
    });
};

const goHome = () => {
    window.location.href = '/';
};

const deleteTrip = async () => {
    try {
        const response = await fetch(`/api/trips/${tripId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Trip deleted successfully!');
            goHome();
        } else {
            const errorResponse = await response.json();
            alert(`Error deleting trip: ${errorResponse.message}`);
        }
    } catch (error) {
        console.error('error deleting trip:', error);
        alert('Failed to delete the trip. Please try again later.');
    }
};

document.getElementById('packing-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const packingInput = document.getElementById('packing-input').value;
    const packingBox = createListItem(packingInput, 'packing', () => savePackingList(tripId));
    document.getElementById('packing-boxes').appendChild(packingBox);
    document.getElementById('packing-input').value = '';
    await savePackingList(tripId);
});

document.getElementById('checklist-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const checklistInput = document.getElementById('checklist-input').value;
    const checklistBox = createListItem(checklistInput, 'checklist', () => saveChecklist(tripId));
    document.getElementById('checklist-boxes').appendChild(checklistBox);
    document.getElementById('checklist-input').value = '';
    await saveChecklist(tripId);
});

document.getElementById('shopping-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const shoppingInput = document.getElementById('shopping-input').value;
    const shoppingBox = createListItem(shoppingInput, 'shopping', () => saveShoppingList(tripId));
    document.getElementById('shopping-boxes').appendChild(shoppingBox);
    document.getElementById('shopping-input').value = '';
    await saveShoppingList(tripId);
});

document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const expenseInput = document.getElementById('expense-input').value;
    const expenseAmount = parseFloat(expenseInput.match(/(\d+)/)[0]);
    const expenseBox = createExpenseItem(expenseInput, expenseAmount, () => saveExpenses(tripId));
    document.getElementById('expense-boxes').appendChild(expenseBox);
    document.getElementById('expense-input').value = '';
    await saveExpenses(tripId);
});

document.getElementById('itinerary-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = document.getElementById('activity-type').value;
    const name = document.getElementById('activity-name').value;
    const date = document.getElementById('activity-date').value;
    const status = document.getElementById('activity-status').value;

    const row = createItineraryRow(type, name, date, status, () => saveItinerary(tripId));
    document.getElementById('itinerary-body').appendChild(row);

    await saveItinerary(tripId);
});

document.getElementById('home-button').addEventListener('click', goHome);

document.getElementById('delete-trip-button').addEventListener('click', deleteTrip);

window.onload = loadTripDetails;

# Travel Planner

A web application to help users plan their trips, manage packing lists, checklists, shopping lists, expenses, and itinerary details.

## Features

- Add new trips with destination names.
- Manage packing lists, checklists, shopping lists, and expenses.
- Add and track itinerary details (flights, lodging, activities).
- Edit and remove items as needed.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Environment**: dotenv for environment variables

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/travel-planner.git
   ```

2. Navigate to the project folder:
   ```bash
   cd travel-planner
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file and add your MongoDB URI:
     ```
     MONGODB_URI=your_mongo_connection_string
     PORT=5001
     ```

5. Start the server:
   ```bash
   npm start
   ```

6. Open the app in your browser:
   ```bash
   http://localhost:5001
   ```

## Usage

- Add new trips and manage related lists (packing, checklist, shopping).
- Update trip expenses and itinerary details.
- Edit or delete trips and their associated data.

## API Endpoints

- `POST /api/trips`: Create a new trip
- `GET /api/trips`: Get all trips
- `GET /api/trips/:id`: Get a single trip by ID
- `PUT /api/trips/:id/name`: Update the trip name
- `DELETE /api/trips/:id`: Delete a trip

# Yelagiri Hills Tourist Guide - Backend

Express.js + MongoDB backend for the Yelagiri Hills Tourist Guide application.

## Features

- RESTful API for categories and listings
- MongoDB database with Mongoose ODM
- CORS enabled for frontend integration
- Search functionality
- CRUD operations for listings

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

## Installation

1. Navigate to the backend directory:
```bash
cd yelagiri-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yelagiri-guide
NODE_ENV=development
```

## Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Linux/Mac
sudo systemctl start mongod

# Or if using MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 2. Seed the Database
```bash
npm run seed
```

### 3. Start the Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 4. Start the Production Server
```bash
npm start
```

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create a new category

### Listings
- `GET /api/listings` - Get all listings (supports `?category=slug` and `?q=search` query params)
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create a new listing
- `PUT /api/listings/:id` - Update a listing
- `DELETE /api/listings/:id` - Delete a listing

## Project Structure

```
yelagiri-backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── categoryController.js
│   └── listingController.js
├── models/
│   ├── Category.js
│   └── Listing.js
├── routes/
│   ├── categoryRoutes.js
│   └── listingRoutes.js
├── .env
├── .gitignore
├── package.json
├── seed.js               # Database seeding script
└── server.js             # Main application file
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

## Notes

- The API is configured to accept requests from any origin (CORS enabled)
- In production, you should add authentication and authorization
- Update the MONGODB_URI to use MongoDB Atlas for cloud deployment

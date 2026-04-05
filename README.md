# Wanderlust

Wanderlust is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for travelers to explore, list, and book incredible accommodations globally. Whether you are looking for a cozy room, an iconic city view, a cabin in the mountains, or a beach house, Wanderlust has you covered.

## ✨ Features

- **Property Listings**: Users can browse and view detailed information regarding various properties, including pricing, location, category, and total rooms available.
- **Booking System**: Check availability and book stays intuitively based on check-in/check-out dates. 
- **Reviews & Ratings**: Booked users can leave reviews and ratings for accommodations.
- **User Authentication**: Secure authentication and authorization (via JWT or session-based cookies) for booking stays and managing properties.
- **Image Uploads**: Upload property images directly using tools like Cloudinary integrated with Multer.

## 🛠️ Tech Stack

**Frontend:**
- React (with Vite or Create React App)
- CSS for custom styling
- React Router DOM for routing

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Joi for payload validation
- Multer for handling file uploads

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)
- Cloudinary Account (for image uploads)

### 1. Clone the repository

```bash
git clone <repository_url>
cd Wanderlust
```

### 2. Backend Setup
Navigate into the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add the following parameters (adjust according to your setup):

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:
```bash
npm start
# or use nodemon for development
npm run dev
```

### 3. Frontend Setup
Navigate into the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
# or npm start if using react-scripts
```

### 4. Running the App
After both servers are running, the backend logic will listen on the specified `PORT` (usually `http://localhost:5000`) and the frontend should be accessible (usually `http://localhost:5173` if utilizing Vite, or `http://localhost:3000`).

## 📁 Project Structure

```
Wanderlust/
├── backend/            # Express server, MongoDB models, API routes, Controllers
├── frontend/           # React SPA, components, views, context
├── .gitignore          # Root environment exclusions
└── README.md           # Project documentation
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is licensed under the MIT License.

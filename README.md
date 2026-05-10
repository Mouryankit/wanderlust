# 🌍 Wanderlust

Wanderlust is a full-stack web application inspired by Airbnb, built using the **MERN (MongoDB, Express, React, Node.js)** stack. It provides a platform for users to list their properties, browse available accommodations, and seamlessly book their next stay.

## ✨ Features

* **User Authentication & Authorization:** Secure sign-up, login, and protected routes. Distinct roles for guests and property owners.
* **Listing Management:** Owners can create, update, and delete their property listings. Includes image uploads via Cloudinary.
* **Advanced Search & Filtering:** Filter listings by destination, category, and minimum required rooms.
* **Booking System:** Robust booking engine that checks for overlapping dates and ensures real-time availability before confirming a reservation.
* **Owner Dashboard:** A dedicated interface for property owners to manage their upcoming, completed, and cancelled bookings.
* **Guest Profile:** A centralized section for guests to view their reservation history and upcoming trips.
* **Review & Rating System:** Guests can leave detailed reviews and star ratings for properties they've visited.
* **Modern UI/UX:** A responsive, interactive, and premium design using a custom "Ocean-Blue" CSS design system. Features smooth micro-animations and global toast notifications (via `react-hot-toast` and `sweetalert2`).

---

## 🛠️ Tech Stack

**Frontend:**
* [React.js](https://reactjs.org/) (via Vite)
* React Router DOM
* Vanilla CSS (Custom Design System)
* React Icons
* React Hot Toast & SweetAlert2 (Notifications)

**Backend:**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) & Mongoose
* Joi (Schema Validation)
* Multer & Cloudinary (Image Uploads)
* JWT / Passport.js (Authentication)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* [Node.js](https://nodejs.org/en/download/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) installed locally or a MongoDB Atlas URI
* A [Cloudinary](https://cloudinary.com/) account for image uploads

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Mouryankit/wanderlust.git
   cd wanderlust
   ```

2. **Setup Backend**
   ```sh
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   SECRET=your_jwt_or_session_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:5173
   ```

3. **Setup Frontend**
   ```sh
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory and add the following variables:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start the Backend Server**
   ```sh
   # In the /backend directory
   npm start
   # or npm run dev (if nodemon is configured)
   ```

2. **Start the Frontend Client**
   ```sh
   # In the /frontend directory
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

---

## 📂 Project Structure

```
wanderlust/
├── backend/                  # Express.js Server
│   ├── config/               # DB Connection & Configurations
│   ├── controllers/          # Route Logic (Listings, Users, Bookings)
│   ├── middleware/           # Auth, Error Handling, Validation
│   ├── models/               # Mongoose Schemas
│   ├── routes/               # API Endpoints
│   └── utils/                # Async Wrappers & Custom Error Classes
│
└── frontend/                 # React Client
    ├── public/               # Static Assets
    └── src/
        ├── components/       # Reusable UI Components
        ├── pages/            # View Templates (Home, Profile, etc.)
        ├── styles/           # Global and Component-Specific CSS
        └── utils/            # Helper Functions & API Services
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Developer

**Ankit Mourya**
* [Portfolio](https://mouryankit.github.io/portfolio/)
* [LinkedIn](https://www.linkedin.com/in/ankit-mourya-7a3185291/)
* [GitHub](https://github.com/Mouryankit)
* [LeetCode](https://leetcode.com/u/Mouryankit/)

# 🌍 Wanderlust

Wanderlust is a full-stack travel booking web application inspired by platforms like Airbnb.  
It allows users to explore unique stays, list their own properties, and book trips with a smooth and modern experience.

This project was built using the **MERN Stack** — MongoDB, Express.js, React.js, and Node.js — with a focus on creating a clean UI, real-world booking logic, and a scalable backend architecture.

## 🚀 Live Demo

- Frontend Deployment: [Render Deployment](https://wanderlust-36j4.onrender.com)
- Backend Deployment: [Render Deployment](https://wanderlust-r-34ck.onrender.com)

---

# ✨ Features

### 🔐 Authentication & Authorization
- Secure signup and login system
- Protected routes for authenticated users
- Separate experiences for guests and property owners

### 🏡 Property Listings
- Create, edit, and delete property listings
- Upload listing images using Cloudinary
- Add property details like price, location, rooms, and description

### 🔎 Search & Filtering
- Search listings by destination
- Filter properties by category and room requirements
- Easy and responsive browsing experience

### 📅 Booking System
- Real-time availability checking
- Prevents overlapping bookings
- Dynamic booking price calculation
- Support for upcoming, completed, and cancelled trips

### 👤 Guest Profile
- View upcoming trips
- Access booking history
- Cancel reservations

### 🧑‍💼 Owner Dashboard
- Manage property listings
- View completed and cancelled stays

### ⭐ Reviews & Ratings
- Leave reviews after completed stays
- Star rating system for listings
- Improve trust and transparency between guests and hosts


### 🎨 Modern UI/UX
- Responsive design
- Smooth animations and transitions
- Toast notifications using `react-hot-toast` and `sweetalert2`

---

# 🛠️ Tech Stack

## Frontend
- React.js (Vite)
- React Router DOM
- Vanilla CSS
- React Icons
- React Hot Toast
- SweetAlert2

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Joi Validation
- JWT / Passport.js Authentication

## Cloud & Media
- Cloudinary
- Multer

---


# 📂 Project Structure

```txt
wanderlust/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── styles/
        └── utils/
```

---

# 🔗 API Routes

## Authentication Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/google` | Google authentication |
| POST | `/api/auth/logout` | Logout user |

---

## Listing Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/listings` | Get all listings |
| POST | `/api/listings` | Create a new listing |
| GET | `/api/listings/:id` | Get single listing details |
| PUT | `/api/listings/:id` | Update listing |
| DELETE | `/api/listings/:id` | Delete listing |

---

## Booking Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/listings/:id/bookings` | Get all bookings for a listing |
| POST | `/api/listings/:id/bookings/verify` | Verify booking availability |
| POST | `/api/listings/:id/bookings` | Create a booking |
| DELETE | `/api/listings/:id/bookings/:bookingId` | Cancel booking |

---

## Review Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/listings/:id/reviews` | Get all reviews for a listing |
| POST | `/api/listings/:id/reviews` | Create a review |
| PUT | `/api/listings/:id/reviews/:reviewId` | Update review |
| DELETE | `/api/listings/:id/reviews/:reviewId` | Delete review |

---

## Profile Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/profile/listings` | Get logged-in user listings |
| GET | `/api/profile/bookings` | Get logged-in user bookings |
| GET | `/api/profile/reviews` | Get logged-in user reviews |

---

# 🛡️ Middleware Features

- Authentication & Authorization
- Protected Routes
- Owner Verification
- Review Author Verification
- Booking Ownership Validation
- Request Validation using Joi
- Centralized Error Handling
- Async Error Wrapper Utility

---

# 📌 API Design Highlights

- RESTful API Architecture
- Nested Routes for Reviews & Bookings
- Modular Route Separation
- Controller-Based Logic
- Middleware-Driven Validation
- Secure Authentication Flow

---

# 👨‍💻 Developer

**Ankit Mourya**

- GitHub: [GitHub Profile](https://github.com/Mouryankit)
- LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/ankit-mourya-7a3185291/)
- Portfolio: [Portfolio Website](https://mouryankit.github.io/portfolio)
- LeetCode: [LeetCode Profile](https://leetcode.com/u/Mouryankit)

---

# Final Note

Wanderlust was built as a real-world MERN stack project to practice scalable backend development, booking logic, authentication, and modern frontend UI design.

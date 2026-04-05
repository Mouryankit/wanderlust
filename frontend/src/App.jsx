
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/users/Login";
// import Signup from "./pages/users/Signup";
// import Dashboard from "./pages/dashboard/Dashboard";
// import Profile from "./pages/users/Profile";
// import NewListing from "./pages/listings/NewListing";
// import Explore from "./pages/listings/Explore";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// import "./App.css";

// function App() {

//   return (
//     <div className="app-container">
//       <main className="main-content">
//         <BrowserRouter>
//           <Navbar />

//           <Routes>

//             <Route path="/" element={<Dashboard />} />
//             <Route path="/profile" element={<Profile />} />

//             <ProtectedRoute>
//               <Route path="/listings/new" element={<NewListing />} />
//             </ProtectedRoute>

//             <Route path="/listings" element={<Explore />} />

//             <Route path="/login" element={<Login />} />

//             <Route path="/signup" element={<Signup />} />

//           </Routes>

//           <Footer />
//         </BrowserRouter>
//       </main>

//     </div>
//   );
// }
// export default App;




import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/users/Login";
import Signup from "./pages/users/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/users/Profile";
import NewListing from "./pages/listings/NewListing";
import Explore from "./pages/listings/Explore";
import ListingDetails from "./pages/listings/ListingDetails";
import EditListing from "./pages/listings/EditListing";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <BrowserRouter>
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/listings" element={<Explore />} />
            <Route path="/listings/:id" element={<ListingDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/listings/new"
              element={
                <ProtectedRoute>
                  <NewListing />
                </ProtectedRoute>
              }
            />

            <Route
              path="/listings/:id/edit"
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer />
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
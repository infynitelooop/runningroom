import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./features/Auth/Login";
import Signup from "./features/Auth/Signup";
import AllNotes from "./features/Notes/AllNotes";
import NoteDetails from "./features/Notes/NoteDetails";
import CreateNote from "./features/Notes/CreateNote";
import Navbar from "./features/Navbar";
import ProtectedRoute from "./features/ProtectedRoute";
import LandingPage from "./features/LandingPage";
import AccessDenied from "./features/Auth/AccessDenied";
import Admin from "./features/Admin/Admin";
import UserProfile from "./features/Auth/UserProfile";
import ForgotPassword from "./features/Auth/ForgotPassword";
import OAuth2RedirectHandler from "./features/Auth/OAuth2RedirectHandler";
import { Toaster } from "react-hot-toast";
import NotFound from "./features/NotFound";
import ContactPage from "./features/contactPage/ContactPage";
import AboutPage from "./features/aboutPage/AboutPage";
import ResetPassword from "./features/Auth/ResetPassword";
import Footer from "./features/Footer/Footer";
import RegistrationSuccess from "./features/Auth/RegistrationSuccess";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Toaster position="bottom-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <NoteDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <AllNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-note"
          element={
            <ProtectedRoute>
              <CreateNote />
            </ProtectedRoute>
          }
        />
        
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminPage={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

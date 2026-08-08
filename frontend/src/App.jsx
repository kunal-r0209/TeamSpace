import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import GoogleSuccess from "./pages/GoogleSuccess";
import Welcome from "./pages/Welcome";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Login */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* Signup */}
                <Route
                    path="/signup"
                    element={<Signup />}
                />

                {/* Forgot Password */}
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                {/* Verify OTP */}
                <Route
                    path="/verify-otp"
                    element={<VerifyOTP />}
                />

                {/* Google Login Success */}
                <Route
                    path="/google-success"
                    element={<GoogleSuccess />}
                />

                {/* Protected Home */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route path="/welcome" 
                element={<Welcome />} />

            </Routes>
        </BrowserRouter>
    );
}
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import {
    FaKey,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowLeft,
    FaArrowRight,
} from "react-icons/fa";

export default function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const resetPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            alert("Please restart the password reset process.");
            navigate("/forgot-password");
            return;
        }

        if (!otp || !newPassword) {
            alert("Please fill all fields.");
            return;
        }

        try {
            setLoading(true);

            await API.post("/auth/verify-otp", {
                email,
                otp,
            });

            // ResetPassword schema accepts email + new_password.
            // OTP is verified by the endpoint above, so it is not sent here.
            await API.post("/auth/reset-password", {
                email,
                new_password: newPassword,
            });

            alert("Password reset successfully!");
            navigate("/");
        } catch (err) {
            alert(
                err.response?.data?.detail ||
                "Verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-layout auth-layout-single">
                <form className="auth-form auth-form-modern" onSubmit={resetPassword}>
                    <Link className="auth-back-link" to="/forgot-password">
                        <FaArrowLeft /> Change email
                    </Link>

                    <div className="auth-mobile-brand">
                        <div className="auth-brand-logo small">T</div>
                        <strong>TeamSpace</strong>
                    </div>

                    <div className="auth-icon-large key-icon">
                        <FaKey />
                    </div>

                    <div className="auth-heading">
                        <span className="auth-label">SECURE RECOVERY</span>
                        <h2>Create a new password</h2>
                        <p>
                            Enter the OTP sent to{" "}
                            <strong>{email || "your email"}</strong> and choose
                            a new password.
                        </p>
                    </div>

                    <label className="auth-field">
                        <span>Verification code</span>
                        <div className="auth-input-wrap">
                            <FaKey />
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                    </label>

                    <label className="auth-field">
                        <span>New password</span>
                        <div className="auth-input-wrap">
                            <FaLock />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </label>

                    <div className="auth-password-rule">
                        <strong>Password requirements</strong>
                        <span>
                            Start with a capital letter · 8+ characters ·
                            lowercase · number · special character
                        </span>
                    </div>

                    <button className="auth-primary-btn" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Reset password"}
                        {!loading && <FaArrowRight />}
                    </button>

                    <p className="auth-bottom-text">
                        Remembered your password? <Link to="/">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { FaEnvelope, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOTP = async (e) => {
        e.preventDefault();

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        try {
            setLoading(true);

            await API.post("/auth/forgot-password", { email });

            alert("OTP sent successfully!");

            navigate("/verify-otp", {
                state: { email },
            });
        } catch (err) {
            alert(
                err.response?.data?.detail ||
                "Failed to send OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-layout auth-layout-single">
                <form className="auth-form auth-form-modern" onSubmit={sendOTP}>
                    <Link className="auth-back-link" to="/">
                        <FaArrowLeft /> Back to login
                    </Link>

                    <div className="auth-mobile-brand">
                        <div className="auth-brand-logo small">T</div>
                        <strong>TeamSpace</strong>
                    </div>

                    <div className="auth-icon-large">✦</div>

                    <div className="auth-heading">
                        <span className="auth-label">ACCOUNT RECOVERY</span>
                        <h2>Forgot your password?</h2>
                        <p>
                            Enter your registered email and we'll send you a
                            verification code.
                        </p>
                    </div>

                    <label className="auth-field">
                        <span>Email address</span>
                        <div className="auth-input-wrap">
                            <FaEnvelope />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                    </label>

                    <button className="auth-primary-btn" type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send verification code"}
                        {!loading && <FaArrowRight />}
                    </button>

                    <p className="auth-bottom-text">
                        Remember your password? <Link to="/">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
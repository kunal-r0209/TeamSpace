import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaGoogle,
    FaArrowRight,
    FaSun,
    FaMoon,
} from "react-icons/fa";

export default function LoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const toggleTheme = () => {
        const next = !darkMode;
        setDarkMode(next);
        document.body.classList.toggle("dark-theme", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    const login = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill all fields.");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            alert(res.data.message);
            navigate("/welcome");
        } catch (err) {
            alert(err.response?.data?.detail || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = () => {
        window.location.href = "http://localhost:8000/auth/google";
    };

    return (
        <div className="auth-page">
            <button className="auth-theme-toggle" onClick={toggleTheme}>
                {darkMode ? <FaSun /> : <FaMoon />}
                <span>{darkMode ? "Light" : "Dark"}</span>
            </button>

            <div className="auth-layout">
                <section className="auth-brand-panel">
                    <div className="auth-brand-logo">T</div>
                    <span className="auth-overline">TEAMSPACE</span>
                    <h1>Everything your team needs, in one place.</h1>
                    <p>
                        A simple and secure workspace to manage your people,
                        keep information organized, and stay in control.
                    </p>

                    <div className="auth-feature-list">
                        <div><span>✓</span> Secure member management</div>
                        <div><span>✓</span> PostgreSQL-backed data</div>
                        <div><span>✓</span> Owner-based permissions</div>
                    </div>
                </section>

                <form className="auth-form auth-form-modern" onSubmit={login}>
                    <div className="auth-mobile-brand">
                        <div className="auth-brand-logo small">T</div>
                        <strong>TeamSpace</strong>
                    </div>

                    <div className="auth-heading">
                        <span className="auth-label">WELCOME BACK</span>
                        <h2>Sign in to your workspace</h2>
                        <p>Enter your credentials to continue.</p>
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

                    <label className="auth-field">
                        <span>Password</span>
                        <div className="auth-input-wrap">
                            <FaLock />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
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

                    <div className="auth-forgot-row">
                        <span>Keep your account secure.</span>
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>

                    <button className="auth-primary-btn" type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                        {!loading && <FaArrowRight />}
                    </button>

                    <div className="auth-divider">
                        <span>OR CONTINUE WITH</span>
                    </div>

                    <button
                        type="button"
                        className="auth-google-btn"
                        onClick={googleLogin}
                    >
                        <FaGoogle />
                        Continue with Google
                    </button>

                    <p className="auth-bottom-text">
                        Don't have an account?{" "}
                        <Link to="/signup">Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaGoogle,
    FaCheck
} from "react-icons/fa";

export default function SignupForm() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const signup = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            await API.post("/auth/signup", {
                name,
                email,
                password,
            });

            alert("Account created successfully!");

            navigate("/");

        } catch (err) {
            alert(
                err.response?.data?.detail ||
                "Signup Failed"
            );
        }
    };

    const googleSignup = () => {
    window.location.href = "https://teamspace-k6wa.onrender.com/auth/google";
};

    return (
        <div className="auth-page">

            {/* Theme button */}
            <button
                className="theme-toggle"
                type="button"
                onClick={() => {
                    document.body.classList.toggle("light-theme");
                }}
            >
                ⚙ <span>Light</span>
            </button>

            <div className="auth-card">

                {/* LEFT SIDE */}
                <div className="auth-brand-panel">

                    <div className="brand-logo">
                        T
                    </div>

                    <div className="brand-small">
                        TEAMSPACE
                    </div>

                    <h1>
                        Build your team,
                        <br />
                        together.
                    </h1>

                    <p>
                        Create your secure workspace and
                        start managing your team members
                        in one organized place.
                    </p>

                    <div className="brand-features">

                        <div className="brand-feature">
                            <span>
                                <FaCheck />
                            </span>
                            <label>
                                Secure member management
                            </label>
                        </div>

                        <div className="brand-feature">
                            <span>
                                <FaCheck />
                            </span>
                            <label>
                                PostgreSQL-backed data
                            </label>
                        </div>

                        <div className="brand-feature">
                            <span>
                                <FaCheck />
                            </span>
                            <label>
                                Owner-based permissions
                            </label>
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="auth-form-panel">

                    <div className="auth-heading">

                        <div className="auth-eyebrow">
                            GET STARTED
                        </div>

                        <h2>
                            Create your workspace
                        </h2>

                        <p>
                            Create an account to get started.
                        </p>

                    </div>

                    <form
                        className="auth-form"
                        onSubmit={signup}
                    >

                        {/* NAME */}
                        <div className="input-group">

                            <label>
                                Full name
                            </label>

                            <div className="input-wrapper">

                                <FaUser className="input-icon" />

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                        {/* EMAIL */}
                        <div className="input-group">

                            <label>
                                Email address
                            </label>

                            <div className="input-wrapper">

                                <FaEnvelope className="input-icon" />

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                        {/* PASSWORD */}
                        <div className="input-group">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <FaLock className="input-icon" />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>

                            </div>

                        </div>

                        <div className="password-rule">
                            Password must start with a capital letter,
                            be at least 8 characters long, and include
                            a lowercase letter, a number, and a special character.
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="input-group">

                            <label>
                                Confirm password
                            </label>

                            <div className="input-wrapper">

                                <FaLock className="input-icon" />

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* CREATE ACCOUNT */}
                        <button
                            type="submit"
                            className="primary-auth-btn"
                        >
                            Create account
                            <span>→</span>
                        </button>

                        {/* DIVIDER */}
                        <div className="auth-divider">

                            <span></span>

                            <small>
                                OR CONTINUE WITH
                            </small>

                            <span></span>

                        </div>

                        {/* GOOGLE */}
                        <button
                            type="button"
                            className="google-btn"
                            onClick={googleSignup}
                        >
                            <FaGoogle />

                            <span>
                                Continue with Google
                            </span>
                        </button>

                        {/* LOGIN */}
                        <p className="auth-footer">
                            Already have an account?{" "}

                            <Link to="/">
                                Sign in
                            </Link>
                        </p>

                    </form>

                </div>

            </div>

        </div>
    );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Home() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        API.get("/profile/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                localStorage.removeItem("token");
                navigate("/");
            });

    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    if (!user) {
        return (
            <div className="loading">
                Loading...
            </div>
        );
    }

    return (

        <div className="home-container">

            <div
                style={{
                    textAlign: "center",
                    marginBottom: "35px",
                }}
            >

                {user.picture ? (
                    <img
                        src={user.picture}
                        alt="Profile"
                        style={{
                            width: "110px",
                            height: "110px",
                            borderRadius: "50%",
                            border: "4px solid #60a5fa",
                            objectFit: "cover",
                            marginBottom: "15px",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "110px",
                            height: "110px",
                            borderRadius: "50%",
                            background: "#2563eb",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "42px",
                            fontWeight: "600",
                            margin: "0 auto 15px",
                        }}
                    >
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                )}

                <h1>
                    Welcome, {user.name}
                </h1>

                <p
                    style={{
                        color: "#dbeafe",
                        marginTop: "8px",
                    }}
                >
                    Glad to have you back 👋
                </p>

            </div>

            <div className="profile-item">
                <strong>📧 Email</strong>
                <br />
                {user.email}
            </div>

            <div className="profile-item">
                <strong>✅ Verified</strong>
                <br />
                {user.verified ? "Verified" : "Not Verified"}
            </div>

            <div className="profile-item">
                <strong>🌐 Login Type</strong>
                <br />
                {user.google_user ? "Google Account" : "Email & Password"}
            </div>

            <div className="profile-item">
                <strong>📅 Account Created</strong>
                <br />
                {user.created_at}
            </div>

            <button
                className="logout-btn"
                onClick={logout}
            >
                Logout
            </button>

        </div>

    );
}
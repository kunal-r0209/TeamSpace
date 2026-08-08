import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Welcome() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [members, setMembers] = useState([]);
    const [deletedMembers, setDeletedMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", organization: "" });

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

    useEffect(() => {
        document.body.classList.toggle("dark-theme", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    useEffect(() => {
        loadProfile();
        loadMembers();
        loadDeletedMembers();
    }, []);

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/");
            const res = await API.get("/profile/me", { headers: headers() });
            setUser(res.data);
        } catch (error) {
            console.error("Profile error:", error);
            localStorage.removeItem("token");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const loadMembers = async () => {
        try {
            const res = await API.get("/members", { headers: headers() });
            setMembers(res.data.members || []);
        } catch (error) {
            console.error("Members error:", error.response?.data || error.message);
        }
    };

    const loadDeletedMembers = async () => {
        try {
            const res = await API.get("/deleted-members", { headers: headers() });
            setDeletedMembers(res.data.members || []);
        } catch (error) {
            console.error("Deleted members error:", error.response?.data || error.message);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const addMember = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some((v) => !v.trim())) return alert("Please fill all fields.");
        try {
            setSubmitting(true);
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => data.append(key, value.trim()));
            await API.post("/add-member", data, { headers: headers() });
            setFormData({ name: "", email: "", phone: "", organization: "" });
            setShowForm(false);
            await loadMembers();
            alert("Member added successfully.");
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to add member.");
        } finally {
            setSubmitting(false);
        }
    };

    const deleteMember = async (id) => {
        const member = members.find((m) => m.id === id);
        if (!window.confirm(`Move ${member?.name || "this member"} to Deleted Members?`)) return;
        try {
            await API.delete(`/members/${id}`, { headers: headers() });
            await Promise.all([loadMembers(), loadDeletedMembers()]);
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to delete member.");
        }
    };

    const restoreMember = async (id) => {
        try {
            await API.put(`/members/${id}/restore`, {}, { headers: headers() });
            await Promise.all([loadMembers(), loadDeletedMembers()]);
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to restore member.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        document.body.classList.remove("dark-theme");
        navigate("/");
    };

    const visibleMembers = useMemo(() => {
        const q = search.toLowerCase().trim();
        const source = showDeleted ? deletedMembers : members;
        if (!q) return source;
        return source.filter((m) => [m.name, m.email, m.phone, m.organization].some((v) => String(v || "").toLowerCase().includes(q)));
    }, [members, deletedMembers, search, showDeleted]);

    if (loading) return <div className="app-loading"><div className="loading-mark">T</div><div><strong>TeamSpace</strong><span>Preparing your workspace...</span></div></div>;

    return (
        <div className="dashboard-shell">
            <header className="dashboard-header">
                <div className="header-inner">
                    <div className="brand"><div className="brand-mark">T</div><div><strong>TeamSpace</strong><span>Member workspace</span></div></div>
                    <div className="header-actions">
                        <button className="icon-button" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">{darkMode ? "☀" : "☾"}</button>
                        <div className="user-chip"><div className="avatar">{(user?.name || "U").charAt(0).toUpperCase()}</div><div className="user-chip-text"><strong>{user?.name || "User"}</strong><span>{user?.email || "Account"}</span></div></div>
                        <button className="logout-button" onClick={logout}>Sign out</button>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="hero-panel">
                    <div><div className="eyebrow">YOUR WORKSPACE</div><h1>Welcome back, {user?.name?.split(" ")[0] || "there"}.</h1><p>Keep your team directory organized, secure and easy to manage.</p></div>
                    <div className="hero-actions">
                        <button className="secondary-button" onClick={() => { setShowDeleted(!showDeleted); setSearch(""); }}>{showDeleted ? "← Active members" : `Deleted members ${deletedMembers.length}`}</button>
                        <button className="primary-button" onClick={() => setShowForm(!showForm)}>{showForm ? "× Close" : "+ Add member"}</button>
                    </div>
                </section>

                <section className="stats-grid">
                    <div className="stat-card"><span className="stat-label">Active members</span><strong>{members.length}</strong><span className="stat-note">Currently in your directory</span></div>
                    <div className="stat-card"><span className="stat-label">Your members</span><strong>{members.filter((m) => m.can_edit).length}</strong><span className="stat-note">Members you manage</span></div>
                    <div className="stat-card"><span className="stat-label">Deleted</span><strong>{deletedMembers.length}</strong><span className="stat-note">Kept safely in the database</span></div>
                </section>

                {showForm && <section className="form-card">
                    <div className="section-heading"><div><div className="eyebrow">NEW MEMBER</div><h2>Add someone to your team</h2><p>Enter the member details. You can manage members you create.</p></div><span className="form-badge">Secure workspace</span></div>
                    <form className="member-form" onSubmit={addMember}>
                        <label>Full name<input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Alex Johnson" /></label>
                        <label>Email address<input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="alex@company.com" /></label>
                        <label>Phone number<input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" /></label>
                        <label>Organization<input name="organization" value={formData.organization} onChange={handleChange} placeholder="Company or organization" /></label>
                        <div className="form-footer"><span>All fields are required.</span><button className="primary-button" disabled={submitting}>{submitting ? "Adding..." : "Add member"}</button></div>
                    </form>
                </section>}

                <section className="members-card">
                    <div className="members-toolbar">
                        <div><div className="eyebrow">{showDeleted ? "ARCHIVE" : "DIRECTORY"}</div><h2>{showDeleted ? "Deleted members" : "Team members"}</h2><p>{showDeleted ? "Deleted records remain stored and can be restored by their creator." : "Everyone can view the directory. Only creators can manage their own records."}</p></div>
                        <div className="search-box"><span>⌕</span><input type="search" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                    </div>

                    {visibleMembers.length === 0 ? <div className="empty-state"><div className="empty-icon">{showDeleted ? "✓" : "+"}</div><h3>{search ? "No matching members" : showDeleted ? "No deleted members" : "Your directory is empty"}</h3><p>{search ? "Try a different search term." : showDeleted ? "Your archive is currently clean." : "Add your first team member to get started."}</p>{!search && !showDeleted && <button className="primary-button" onClick={() => setShowForm(true)}>Add your first member</button>}</div> : (
                        <div className="table-wrapper"><table className="members-table"><thead><tr><th>Member</th><th>Email</th><th>Phone</th><th>Organization</th><th>Access</th><th>Actions</th></tr></thead><tbody>
                            {visibleMembers.map((member) => <tr key={member.id}>
                                <td><div className="member-identity"><div className="member-avatar">{(member.name || "M").charAt(0).toUpperCase()}</div><div><strong>{member.name}</strong><span>Member #{member.id}</span></div></div></td>
                                <td>{member.email}</td><td>{member.phone}</td><td><span className="organization-pill">{member.organization}</span></td>
                                <td>{showDeleted ? (member.can_restore ? <span className="status-badge owner">Your record</span> : <span className="status-badge viewer">View only</span>) : (member.can_edit ? <span className="status-badge owner">Owner</span> : <span className="status-badge viewer">View only</span>)}</td>
                                <td><div className="row-actions">{showDeleted ? (member.can_restore ? <button className="table-action restore" onClick={() => restoreMember(member.id)}>Restore</button> : <span className="locked-action">Locked</span>) : (member.can_edit ? <><button className="table-action edit" onClick={() => alert(`Edit functionality can be connected to your existing update endpoint for ${member.name}.`)}>Edit</button><button className="table-action delete" onClick={() => deleteMember(member.id)}>Delete</button></> : <span className="locked-action">Locked</span>)}</div></td>
                            </tr>)}
                        </tbody></table></div>
                    )}
                </section>
                <footer className="dashboard-footer"><span>TeamSpace · Secure team directory</span><span>PostgreSQL backed workspace</span></footer>
            </main>
        </div>
    );
}
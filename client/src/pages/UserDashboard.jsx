import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/UserDashboard.css";

const UserDashboard = () => {
    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const storedUser = JSON.parse(
        localStorage.getItem("userInfo") || "{}"
    );

    const userName = storedUser.name || "Customer";
    const userEmail = storedUser.email || "RateHub User";
    const userAddress = storedUser.address || "Address not available";

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/user/stores?search=${encodeURIComponent(search)}`
                );

                setStores(response.data.data || []);
            } catch (error) {
                console.error("Fetch stores error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load stores"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, [search]);

    const handleRatingChange = async (
        storeId,
        ratingId,
        newRating
    ) => {
        if (!newRating) return;

        try {
            if (ratingId) {
                await api.put(`/ratings/${ratingId}`, {
                    rating: Number(newRating)
                });
            } else {
                await api.post("/ratings", {
                    storeId,
                    rating: Number(newRating)
                });
            }

            const response = await api.get(
                `/user/stores?search=${encodeURIComponent(search)}`
            );

            setStores(response.data.data || []);

        } catch (error) {
            console.error("Rating error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to submit rating"
            );
        }
    };

    const renderStars = (rating) => {
        const value = Number(rating) || 0;

        return (
            <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={
                            star <= Math.round(value)
                                ? "star filled"
                                : "star"
                        }
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const openPasswordModal = () => {
        setShowAccountMenu(false);
        setShowPasswordModal(true);
        setPasswordMessage("");
        setPasswordError("");

        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
    };

    const closePasswordModal = () => {
        if (passwordLoading) return;

        setShowPasswordModal(false);
        setPasswordMessage("");
        setPasswordError("");
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = passwordData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError(
                "Please fill in all password fields."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(
                "New password and confirm password do not match."
            );
            return;
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(newPassword)) {
            setPasswordError(
                "Password must be 8-16 characters and contain at least one uppercase letter and one special character."
            );
            return;
        }

        try {
            setPasswordLoading(true);

            const response = await api.put(
                "/user/password",
                {
                    currentPassword,
                    newPassword
                }
            );

            setPasswordMessage(
                response.data?.message ||
                "Password updated successfully."
            );

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {
            console.error(
                "Change password error:",
                error
            );

            setPasswordError(
                error.response?.data?.message ||
                "Failed to update password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");

        navigate("/login", {
            replace: true
        });
    };

    return (
        <div className="user-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="user-sidebar">

                <div className="brand">
                    <div className="brand-icon">
                        ★
                    </div>

                    <div>
                        <h2>RateHub</h2>
                        <span>USER PORTAL</span>
                    </div>
                </div>

                <nav className="sidebar-nav">

                    <div className="nav-item active">
                        <span>⌂</span>
                        <span>Stores</span>
                    </div>

                </nav>

                <div className="sidebar-footer">

                    <div className="secure-box">
                        <span className="secure-icon">
                            ✓
                        </span>

                        <div>
                            <strong>
                                Secure session
                            </strong>

                            <small>
                                User access
                            </small>
                        </div>
                    </div>

                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="user-main">

                {/* ================= HEADER ================= */}

                <header className="user-header">

                    <div>
                        <span className="section-label">
                            CUSTOMER PORTAL
                        </span>

                        <h1>
                            Store Ratings
                        </h1>
                    </div>


                    {/* ACCOUNT */}

                    <div className="account-container">

                        <button
                            className="user-profile"
                            onClick={() =>
                                setShowAccountMenu(
                                    !showAccountMenu
                                )
                            }
                        >

                            <div className="avatar">
                                {userName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>
                                <strong>
                                    {userName}
                                </strong>

                                <span>
                                    RateHub User
                                </span>
                            </div>

                            <span className="profile-arrow">
                                ▾
                            </span>

                        </button>


                        {showAccountMenu && (
                            <div className="account-menu">

                                <div className="account-menu-header">

                                    <div className="menu-avatar">
                                        {userName
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>
                                            {userName}
                                        </strong>

                                        <span>
                                            {userEmail}
                                        </span>
                                    </div>

                                </div>

                                <div className="menu-divider" />

                                <button
                                    onClick={() => {
                                        setShowAccountMenu(false);
                                        setShowProfile(true);
                                    }}
                                >
                                    <span>👤</span>
                                    My Profile
                                </button>

                                <button
                                    onClick={openPasswordModal}
                                >
                                    <span>🔐</span>
                                    Change Password
                                </button>

                                <div className="menu-divider" />

                                <button
                                    className="menu-logout"
                                    onClick={handleLogout}
                                >
                                    <span>↪</span>
                                    Logout
                                </button>

                            </div>
                        )}

                    </div>

                </header>


                {/* ================= HERO ================= */}

                <section className="user-hero">

                    <div className="hero-content">

                        <span className="hero-label">
                            WELCOME TO RATEHUB
                        </span>

                        <h2>
                            Discover stores.
                            <br />
                            Share your experience.
                        </h2>

                        <p>
                            Find stores, check customer
                            ratings and share your own
                            experience.
                        </p>

                    </div>

                    <div className="hero-icon">
                        ★
                    </div>

                </section>


                {/* ================= SEARCH ================= */}

                <section className="search-section">

                    <div>

                        <span className="section-label">
                            EXPLORE
                        </span>

                        <h2>
                            Find a Store
                        </h2>

                        <p>
                            Search for a store by name.
                        </p>

                    </div>

                    <div className="search-box">

                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search stores..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        {search && (
                            <button
                                className="clear-search"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>
                        )}

                    </div>

                </section>


                {/* ================= ERROR ================= */}

                {error && (
                    <div className="error-message">

                        <span>!</span>

                        {error}

                    </div>
                )}


                {/* ================= STORES ================= */}

                <section className="stores-section">

                    <div className="stores-heading">

                        <div>

                            <span className="section-label">
                                AVAILABLE STORES
                            </span>

                            <h2>
                                Stores
                            </h2>

                        </div>

                        {!loading && (
                            <span className="store-count">
                                {stores.length}{" "}
                                {stores.length === 1
                                    ? "store"
                                    : "stores"}
                            </span>
                        )}

                    </div>


                    {loading ? (

                        <div className="loading-grid">

                            {[1, 2, 3].map((item) => (
                                <div
                                    className="store-card skeleton"
                                    key={item}
                                >
                                    <div className="skeleton-line large" />
                                    <div className="skeleton-line" />
                                    <div className="skeleton-line short" />
                                </div>
                            ))}

                        </div>

                    ) : stores.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ⌕
                            </div>

                            <h3>
                                No stores found
                            </h3>

                            <p>
                                Try searching with a
                                different store name.
                            </p>

                            {search && (
                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    Clear Search
                                </button>
                            )}

                        </div>

                    ) : (

                        <div className="store-grid">

                            {stores.map((store) => {

                                const overallRating =
                                    Number(
                                        store.overall_rating
                                    ) || 0;

                                const userRating =
                                    store.user_rating;

                                return (
                                    <article
                                        className="store-card"
                                        key={store.id}
                                    >

                                        <div className="store-card-header">

                                            <div className="store-icon">
                                                🏪
                                            </div>

                                            <div className="store-title">

                                                <h3>
                                                    {store.name}
                                                </h3>

                                                <span>
                                                    Store #{store.id}
                                                </span>

                                            </div>

                                        </div>


                                        <div className="store-address">

                                            <span>
                                                ⌖
                                            </span>

                                            <p>
                                                {store.address ||
                                                    "Address not available"}
                                            </p>

                                        </div>


                                        <div className="rating-summary">

                                            <div>

                                                <span className="rating-label">
                                                    CUSTOMER RATING
                                                </span>

                                                <div className="rating-value">

                                                    <strong>
                                                        {overallRating.toFixed(
                                                            1
                                                        )}
                                                    </strong>

                                                    {renderStars(
                                                        overallRating
                                                    )}

                                                </div>

                                            </div>

                                        </div>


                                        <div className="your-rating">

                                            <div className="your-rating-header">

                                                <div>

                                                    <span className="rating-label">
                                                        YOUR RATING
                                                    </span>

                                                    <strong>
                                                        {userRating
                                                            ? `${userRating}/5`
                                                            : "Not rated yet"}
                                                    </strong>

                                                </div>

                                                {userRating && (
                                                    <span className="rated-badge">
                                                        Rated
                                                    </span>
                                                )}

                                            </div>


                                            <div className="rating-selector">

                                                <span>
                                                    {userRating
                                                        ? "Update rating"
                                                        : "Rate this store"}
                                                </span>

                                                <select
                                                    value={
                                                        userRating || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleRatingChange(
                                                            store.id,
                                                            store.rating_id,
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="">
                                                        Select rating
                                                    </option>

                                                    <option value="1">
                                                        1 ★ — Poor
                                                    </option>

                                                    <option value="2">
                                                        2 ★ — Fair
                                                    </option>

                                                    <option value="3">
                                                        3 ★ — Good
                                                    </option>

                                                    <option value="4">
                                                        4 ★ — Very Good
                                                    </option>

                                                    <option value="5">
                                                        5 ★ — Excellent
                                                    </option>

                                                </select>

                                            </div>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>
                    )}

                </section>

            </main>


            {/* ================= PROFILE MODAL ================= */}

            {showProfile && (
                <div
                    className="user-modal-overlay"
                    onClick={() =>
                        setShowProfile(false)
                    }
                >

                    <div
                        className="user-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-top">

                            <div>
                                <span className="section-label">
                                    ACCOUNT
                                </span>

                                <h2>
                                    My Profile
                                </h2>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowProfile(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="profile-large">

                            <div className="profile-large-avatar">
                                {userName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>
                                <h3>
                                    {userName}
                                </h3>

                                <span>
                                    Normal User
                                </span>
                            </div>

                        </div>


                        <div className="profile-details">

                            <div>
                                <span>
                                    FULL NAME
                                </span>

                                <strong>
                                    {userName}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    EMAIL
                                </span>

                                <strong>
                                    {userEmail}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    ADDRESS
                                </span>

                                <strong>
                                    {userAddress}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>
            )}


            {/* ================= PASSWORD MODAL ================= */}

            {showPasswordModal && (
                <div
                    className="user-modal-overlay"
                    onClick={closePasswordModal}
                >

                    <div
                        className="user-modal password-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-top">

                            <div>
                                <span className="section-label">
                                    SECURITY
                                </span>

                                <h2>
                                    Change Password
                                </h2>

                                <p>
                                    Keep your RateHub account
                                    secure.
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={closePasswordModal}
                            >
                                ×
                            </button>

                        </div>


                        {passwordMessage && (
                            <div className="password-success">
                                ✓ {passwordMessage}
                            </div>
                        )}


                        {passwordError && (
                            <div className="password-error">
                                ! {passwordError}
                            </div>
                        )}


                        <form
                            className="password-form"
                            onSubmit={handlePasswordSubmit}
                        >

                            <div className="password-field">

                                <label>
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={
                                        passwordData.currentPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="Enter current password"
                                    disabled={passwordLoading}
                                />

                            </div>


                            <div className="password-field">

                                <label>
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="newPassword"
                                    value={
                                        passwordData.newPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="Enter new password"
                                    disabled={passwordLoading}
                                />

                                <small>
                                    8–16 characters, one uppercase
                                    letter and one special character.
                                </small>

                            </div>


                            <div className="password-field">

                                <label>
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={
                                        passwordData.confirmPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="Confirm new password"
                                    disabled={passwordLoading}
                                />

                            </div>


                            <div className="password-actions">

                                <button
                                    type="button"
                                    className="password-cancel"
                                    onClick={closePasswordModal}
                                    disabled={passwordLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="password-submit"
                                    disabled={passwordLoading}
                                >
                                    {passwordLoading
                                        ? "Updating..."
                                        : "Update Password"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default UserDashboard;
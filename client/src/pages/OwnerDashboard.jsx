import { useEffect, useState } from "react";
import api from "../services/api";

const OwnerDashboard = () => {
    // =========================
    // DASHBOARD STATES
    // =========================

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // STORE EDIT STATES
    // =========================

    const [editingStore, setEditingStore] = useState(null);

    const [storeForm, setStoreForm] = useState({
        name: "",
        email: "",
        address: ""
    });

    const [storeMessage, setStoreMessage] = useState("");
    const [storeError, setStoreError] = useState("");
    const [savingStore, setSavingStore] = useState(false);

    // =========================
    // PASSWORD STATES
    // =========================

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    // =========================
    // ACCOUNT MENU / MODALS
    // =========================

    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // =========================
    // USER INFORMATION
    // =========================

    let storedUser = {};

    try {
        storedUser = JSON.parse(
            localStorage.getItem("userInfo") || "{}"
        );
    } catch (error) {
        console.error("Failed to read userInfo:", error);
    }

    const ownerName = storedUser.name || "Store Owner";
    const ownerEmail = storedUser.email || "owner@example.com";
    const ownerAddress =
        storedUser.address || "Pune, Maharashtra";

    // =========================
    // FETCH DASHBOARD
    // =========================

    const fetchDashboard = async () => {
        try {
            setError("");

            const response = await api.get(
                "/owner/dashboard"
            );

            setDashboard(response.data.data);
        } catch (err) {
            console.error(
                "Owner dashboard error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load owner dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    // =========================
    // STORE EDITING
    // =========================

    const startEditing = (store) => {
        setEditingStore(store);

        setStoreForm({
            name: store.name || "",
            email: store.email || "",
            address: store.address || ""
        });

        setStoreMessage("");
        setStoreError("");
    };

    const cancelEditing = () => {
        setEditingStore(null);
        setStoreMessage("");
        setStoreError("");
    };

    const handleStoreChange = (e) => {
        setStoreForm({
            ...storeForm,
            [e.target.name]: e.target.value
        });
    };

    const handleStoreUpdate = async (e) => {
        e.preventDefault();

        setStoreMessage("");
        setStoreError("");

        try {
            setSavingStore(true);

            const response = await api.put(
                `/owner/stores/${editingStore.id}`,
                storeForm
            );

            setStoreMessage(
                response.data.message ||
                "Store updated successfully"
            );

            setEditingStore(null);

            await fetchDashboard();
        } catch (err) {
            console.error(
                "Store update error:",
                err
            );

            setStoreError(
                err.response?.data?.message ||
                "Failed to update store"
            );
        } finally {
            setSavingStore(false);
        }
    };

    // =========================
    // CHANGE PASSWORD
    // =========================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        if (newPassword.length < 6) {
            setPasswordError(
                "New password must be at least 6 characters"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(
                "New passwords do not match"
            );
            return;
        }

        try {
            setChangingPassword(true);

            const response = await api.put(
                "/owner/password",
                {
                    currentPassword,
                    newPassword
                }
            );

            setPasswordMessage(
                response.data.message ||
                "Password updated successfully"
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {
            console.error(
                "Change password error:",
                err
            );

            setPasswordError(
                err.response?.data?.message ||
                "Failed to change password"
            );
        } finally {
            setChangingPassword(false);
        }
    };

    // =========================
    // OPEN PASSWORD MODAL
    // =========================

    const openPasswordModal = () => {
        setShowAccountMenu(false);

        setPasswordMessage("");
        setPasswordError("");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setShowPasswordModal(true);
    };

    // =========================
    // CLOSE PASSWORD MODAL
    // =========================

    const closePasswordModal = () => {
        if (changingPassword) {
            return;
        }

        setShowPasswordModal(false);

        setPasswordMessage("");
        setPasswordError("");
    };

    // =========================
    // PROFILE MODAL
    // =========================

    const openProfileModal = () => {
        setShowAccountMenu(false);
        setShowProfileModal(true);
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");

        window.location.href = "/login";
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="page-shell">

                <div className="loading-card">

                    <div className="spinner"></div>

                    <p>
                        Loading your dashboard...
                    </p>

                </div>

            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="page-shell">

                <div className="error-card">

                    <div className="status-icon">
                        !
                    </div>

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="primary-btn"
                        onClick={fetchDashboard}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    // =========================
    // DATA
    // =========================

    const stores =
        dashboard?.stores || [];

    const ratingUsers =
        dashboard?.ratingUsers || [];

    // =========================
    // MAIN UI
    // =========================

    return (
        <div className="page-shell">

            {/* =================================
                OWNER ACCOUNT BAR
            ================================== */}

            <div className="owner-account-bar">

                <div className="owner-brand">

                    <div className="owner-brand-icon">
                        ★
                    </div>

                    <div>

                        <strong>
                            RateHub
                        </strong>

                        <span>
                            OWNER PORTAL
                        </span>

                    </div>

                </div>


                <div className="owner-account-container">

                    <button
                        type="button"
                        className="owner-profile-button"
                        onClick={() =>
                            setShowAccountMenu(
                                !showAccountMenu
                            )
                        }
                    >

                        <div className="owner-avatar">
                            {ownerName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="owner-profile-text">

                            <strong>
                                {ownerName}
                            </strong>

                            <span>
                                Store Owner
                            </span>

                        </div>

                        <span className="owner-arrow">
                            ▾
                        </span>

                    </button>


                    {/* ACCOUNT DROPDOWN */}

                    {showAccountMenu && (
                        <div className="owner-account-menu">

                            <div className="owner-menu-header">

                                <div className="owner-menu-avatar">
                                    {ownerName
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <strong>
                                        {ownerName}
                                    </strong>

                                    <span>
                                        {ownerEmail}
                                    </span>

                                </div>

                            </div>


                            <div className="owner-menu-divider" />


                            <button
                                type="button"
                                onClick={
                                    openProfileModal
                                }
                            >
                                <span>👤</span>
                                My Profile
                            </button>


                            <button
                                type="button"
                                onClick={
                                    openPasswordModal
                                }
                            >
                                <span>🔐</span>
                                Change Password
                            </button>


                            <div className="owner-menu-divider" />


                            <button
                                type="button"
                                className="owner-menu-logout"
                                onClick={handleLogout}
                            >
                                <span>↪</span>
                                Logout
                            </button>

                        </div>
                    )}

                </div>

            </div>


            {/* =================================
                DASHBOARD HERO
            ================================== */}

            <header className="dashboard-hero">

                <div>

                    <span className="eyebrow">
                        OWNER PORTAL
                    </span>

                    <h1>
                        Owner Dashboard
                    </h1>

                    <p>
                        Manage your stores and keep
                        track of customer ratings.
                    </p>

                </div>


                <div className="hero-badge">

                    <span>
                        ⭐
                    </span>

                    <div>

                        <strong>
                            {stores.length}
                        </strong>

                        <small>
                            {stores.length === 1
                                ? "Store"
                                : "Stores"}
                        </small>

                    </div>

                </div>

            </header>


            {/* =================================
                STORE SUCCESS MESSAGE
            ================================== */}

            {storeMessage && (
                <div className="alert success-alert">

                    <span>
                        ✓
                    </span>

                    {storeMessage}

                </div>
            )}


            {/* =================================
                MY STORES
            ================================== */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            BUSINESS
                        </span>

                        <h2>
                            My Stores
                        </h2>

                    </div>

                    <span className="count-pill">
                        {stores.length}
                    </span>

                </div>


                {stores.length === 0 ? (

                    <div className="empty-card">

                        <div className="empty-icon">
                            🏪
                        </div>

                        <h3>
                            No stores found
                        </h3>

                        <p>
                            You don't have any stores
                            assigned to your account.
                        </p>

                    </div>

                ) : (

                    <div className="store-grid">

                        {stores.map((store) => (

                            <article
                                className="store-card"
                                key={store.id}
                            >

                                <div className="store-card-top">

                                    <div className="store-icon">
                                        🏪
                                    </div>

                                    <button
                                        type="button"
                                        className="outline-btn"
                                        onClick={() =>
                                            startEditing(store)
                                        }
                                    >
                                        Edit Store
                                    </button>

                                </div>


                                <h3>
                                    {store.name}
                                </h3>


                                <div className="store-detail">

                                    <span>
                                        ✉
                                    </span>

                                    <span>
                                        {store.email}
                                    </span>

                                </div>


                                <div className="store-detail">

                                    <span>
                                        📍
                                    </span>

                                    <span>
                                        {store.address}
                                    </span>

                                </div>


                                <div className="rating-box">

                                    <div>

                                        <span className="rating-number">
                                            {Number(
                                                store.average_rating || 0
                                            ).toFixed(1)}
                                        </span>

                                        <span className="rating-stars">
                                            ★★★★★
                                        </span>

                                    </div>

                                    <small>
                                        Average customer rating
                                    </small>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>


            {/* =================================
                EDIT STORE
            ================================== */}

            {editingStore && (

                <section className="edit-panel">

                    <div className="section-heading">

                        <div>

                            <span className="section-label">
                                MANAGEMENT
                            </span>

                            <h2>
                                Edit Store
                            </h2>

                        </div>

                    </div>


                    <form
                        onSubmit={handleStoreUpdate}
                        className="form-card"
                    >

                        {storeError && (

                            <div className="alert error-alert">

                                <span>
                                    !
                                </span>

                                {storeError}

                            </div>

                        )}


                        <div className="form-grid">

                            <div className="form-group">

                                <label htmlFor="store-name">
                                    Store Name
                                </label>

                                <input
                                    id="store-name"
                                    name="name"
                                    value={
                                        storeForm.name
                                    }
                                    onChange={
                                        handleStoreChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="store-email">
                                    Store Email
                                </label>

                                <input
                                    id="store-email"
                                    name="email"
                                    type="email"
                                    value={
                                        storeForm.email
                                    }
                                    onChange={
                                        handleStoreChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group full-width">

                                <label htmlFor="store-address">
                                    Address
                                </label>

                                <input
                                    id="store-address"
                                    name="address"
                                    value={
                                        storeForm.address
                                    }
                                    onChange={
                                        handleStoreChange
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={
                                    cancelEditing
                                }
                                disabled={
                                    savingStore
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={
                                    savingStore
                                }
                            >
                                {savingStore
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </section>

            )}


            {/* =================================
                RATING USERS
            ================================== */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            CUSTOMER ACTIVITY
                        </span>

                        <h2>
                            Rating Users
                        </h2>

                    </div>

                    <span className="count-pill">
                        {ratingUsers.length}
                    </span>

                </div>


                {ratingUsers.length === 0 ? (

                    <div className="empty-card">

                        <div className="empty-icon">
                            💬
                        </div>

                        <h3>
                            No ratings yet
                        </h3>

                        <p>
                            Customer ratings will appear
                            here once users rate your store.
                        </p>

                    </div>

                ) : (

                    <div className="ratings-card">

                        {ratingUsers.map(
                            (user, index) => (

                                <div
                                    className="rating-user"
                                    key={index}
                                >

                                    <div className="avatar">
                                        {(user.user_name ||
                                            "U")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>


                                    <div className="rating-user-info">

                                        <strong>
                                            {user.user_name}
                                        </strong>

                                        <span>
                                            {user.user_email}
                                        </span>

                                        <small>
                                            {user.store_name}
                                        </small>

                                    </div>


                                    <div className="user-rating">

                                        <strong>
                                            {user.rating}/5
                                        </strong>

                                        <span>
                                            ★★★★★
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================
                PROFILE MODAL
            ================================== */}

            {showProfileModal && (

                <div
                    className="owner-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeProfileModal();
                        }

                    }}
                >

                    <div className="owner-modal">

                        <div className="owner-modal-header">

                            <div>

                                <span className="section-label">
                                    OWNER PROFILE
                                </span>

                                <h2>
                                    My Profile
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="owner-modal-close"
                                onClick={
                                    closeProfileModal
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="owner-profile-large">

                            <div className="owner-profile-large-avatar">

                                {ownerName
                                    .charAt(0)
                                    .toUpperCase()}

                            </div>

                            <div>

                                <h3>
                                    {ownerName}
                                </h3>

                                <span>
                                    Store Owner
                                </span>

                            </div>

                        </div>


                        <div className="owner-profile-details">

                            <div>

                                <span>
                                    NAME
                                </span>

                                <strong>
                                    {ownerName}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    EMAIL
                                </span>

                                <strong>
                                    {ownerEmail}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    ADDRESS
                                </span>

                                <strong>
                                    {ownerAddress}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    ROLE
                                </span>

                                <strong>
                                    OWNER
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================
                CHANGE PASSWORD MODAL
            ================================== */}

            {showPasswordModal && (

                <div
                    className="owner-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closePasswordModal();
                        }

                    }}
                >

                    <div className="owner-modal">

                        <div className="owner-modal-header">

                            <div>

                                <span className="section-label">
                                    SECURITY
                                </span>

                                <h2>
                                    Change Password
                                </h2>

                                <p>
                                    Update your owner account
                                    password securely.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="owner-modal-close"
                                onClick={
                                    closePasswordModal
                                }
                            >
                                ×
                            </button>

                        </div>


                        {passwordMessage && (

                            <div className="alert success-alert">

                                <span>
                                    ✓
                                </span>

                                {passwordMessage}

                            </div>

                        )}


                        {passwordError && (

                            <div className="alert error-alert">

                                <span>
                                    !
                                </span>

                                {passwordError}

                            </div>

                        )}


                        <form
                            onSubmit={
                                handleChangePassword
                            }
                            className="owner-password-form"
                        >

                            <div className="form-group full-width">

                                <label htmlFor="current-password">
                                    Current Password
                                </label>

                                <input
                                    id="current-password"
                                    type="password"
                                    value={
                                        currentPassword
                                    }
                                    onChange={(e) =>
                                        setCurrentPassword(
                                            e.target.value
                                        )
                                    }
                                    required
                                    disabled={
                                        changingPassword
                                    }
                                    placeholder="Enter current password"
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="new-password">
                                    New Password
                                </label>

                                <input
                                    id="new-password"
                                    type="password"
                                    value={
                                        newPassword
                                    }
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    minLength="6"
                                    required
                                    disabled={
                                        changingPassword
                                    }
                                    placeholder="Enter new password"
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="confirm-password">
                                    Confirm New Password
                                </label>

                                <input
                                    id="confirm-password"
                                    type="password"
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    minLength="6"
                                    required
                                    disabled={
                                        changingPassword
                                    }
                                    placeholder="Confirm new password"
                                />

                            </div>


                            <div className="owner-password-actions">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={
                                        closePasswordModal
                                    }
                                    disabled={
                                        changingPassword
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={
                                        changingPassword
                                    }
                                >
                                    {changingPassword
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

export default OwnerDashboard;
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "../css/AdminDashboard.css";

const emptyUserForm = {
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER"
};

const emptyStoreForm = {
    name: "",
    email: "",
    address: "",
    ownerId: ""
};

const AdminDashboard = () => {

    const [activeTab, setActiveTab] = useState("overview");

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });

    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(false);
    const [storesLoading, setStoresLoading] = useState(false);

    const [error, setError] = useState("");
    // Admin Profile

    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    let storedUser = {};

    try {
        storedUser = JSON.parse(
            localStorage.getItem("userInfo") || "{}"
        );
    } catch (error) {
        console.error(
            "Failed to read userInfo:",
            error
        );
    }

    const adminName =
        storedUser.name || "Administrator";

    const adminEmail =
        storedUser.email || "Email not available";

    const adminAddress =
        storedUser.address || "Address not available";
    // User Filters

    const [userFilters, setUserFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: "",
        sortBy: "name",
        sortOrder: "asc"
    });
    // Store Filters

    const [storeFilters, setStoreFilters] = useState({
        name: "",
        email: "",
        address: "",
        sortBy: "name",
        sortOrder: "asc"
    });
    // Modals

    const [showUserModal, setShowUserModal] = useState(false);
    const [showStoreModal, setShowStoreModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    // Forms

    const [userForm, setUserForm] = useState(
        emptyUserForm
    );

    const [storeForm, setStoreForm] = useState(
        emptyStoreForm
    );

    const [formLoading, setFormLoading] =
        useState(false);

    const [formMessage, setFormMessage] =
        useState("");

    const [formError, setFormError] =
        useState("");
    // Fetch Dashboard

    const fetchDashboard = async () => {
        try {
            setError("");

            const response =
                await api.get("/admin/dashboard");

            setStats(
                response.data.data || {
                    totalUsers: 0,
                    totalStores: 0,
                    totalRatings: 0
                }
            );
        } catch (err) {
            console.error(
                "Admin dashboard error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load admin dashboard"
            );
        }
    };
    // Fetch Users

    const fetchUsers = async () => {
        try {
            setUsersLoading(true);

            const params = new URLSearchParams();

            if (userFilters.name) {
                params.append(
                    "name",
                    userFilters.name
                );
            }

            if (userFilters.email) {
                params.append(
                    "email",
                    userFilters.email
                );
            }

            if (userFilters.address) {
                params.append(
                    "address",
                    userFilters.address
                );
            }

            if (userFilters.role) {
                params.append(
                    "role",
                    userFilters.role
                );
            }

            params.append(
                "sortBy",
                userFilters.sortBy
            );

            params.append(
                "sortOrder",
                userFilters.sortOrder
            );

            const response = await api.get(
                `/admin/users?${params.toString()}`
            );

            setUsers(
                response.data.data || []
            );
        } catch (err) {
            console.error(
                "Fetch users error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load users"
            );
        } finally {
            setUsersLoading(false);
        }
    };
    // Fetch Stores

    const fetchStores = async () => {
        try {
            setStoresLoading(true);

            const params = new URLSearchParams();

            if (storeFilters.name) {
                params.append(
                    "name",
                    storeFilters.name
                );
            }

            if (storeFilters.email) {
                params.append(
                    "email",
                    storeFilters.email
                );
            }

            if (storeFilters.address) {
                params.append(
                    "address",
                    storeFilters.address
                );
            }

            params.append(
                "sortBy",
                storeFilters.sortBy
            );

            params.append(
                "sortOrder",
                storeFilters.sortOrder
            );

            const response = await api.get(
                `/admin/stores?${params.toString()}`
            );

            setStores(
                response.data.data || []
            );
        } catch (err) {
            console.error(
                "Fetch stores error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load stores"
            );
        } finally {
            setStoresLoading(false);
        }
    };
    // Initial Load

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                fetchDashboard(),
                fetchUsers(),
                fetchStores()
            ]);

            setLoading(false);
        };

        loadData();

    }, []);
    // User Filter Effect

    useEffect(() => {

        if (!loading) {
            fetchUsers();
        }

    }, [
        userFilters.name,
        userFilters.email,
        userFilters.address,
        userFilters.role,
        userFilters.sortBy,
        userFilters.sortOrder
    ]);
    // Store Filter Effect

    useEffect(() => {

        if (!loading) {
            fetchStores();
        }

    }, [
        storeFilters.name,
        storeFilters.email,
        storeFilters.address,
        storeFilters.sortBy,
        storeFilters.sortOrder
    ]);
    // User Form

    const handleUserChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setUserForm(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );
    };

    const validateUserForm = () => {

        if (
            userForm.name.trim().length < 20
        ) {
            return "Name must contain at least 20 characters.";
        }

        if (
            userForm.name.trim().length > 60
        ) {
            return "Name cannot exceed 60 characters.";
        }

        if (
            userForm.address.length > 400
        ) {
            return "Address cannot exceed 400 characters.";
        }

        if (
            userForm.password.length < 8 ||
            userForm.password.length > 16
        ) {
            return "Password must be 8-16 characters.";
        }

        if (
            !/[A-Z]/.test(
                userForm.password
            )
        ) {
            return "Password must contain at least one uppercase letter.";
        }

        if (
            !/[!@#$%^&*(),.?":{}|<>_\-\\[\];'/+=`~]/.test(
                userForm.password
            )
        ) {
            return "Password must contain at least one special character.";
        }

        return "";
    };

    const handleCreateUser = async (e) => {

        e.preventDefault();

        setFormMessage("");
        setFormError("");

        const validationError =
            validateUserForm();

        if (validationError) {
            setFormError(
                validationError
            );

            return;
        }

        try {

            setFormLoading(true);

            const response =
                await api.post(
                    "/admin/users",
                    userForm
                );

            setFormMessage(
                response.data.message ||
                "User created successfully."
            );

            setUserForm(
                emptyUserForm
            );

            await Promise.all([
                fetchUsers(),
                fetchDashboard()
            ]);

            setTimeout(() => {

                setShowUserModal(false);

                setFormMessage("");

            }, 900);

        } catch (err) {

            console.error(
                "Create user error:",
                err
            );

            setFormError(
                err.response?.data?.message ||
                "Failed to create user."
            );

        } finally {

            setFormLoading(false);
        }
    };
    // Store Form

    const handleStoreChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setStoreForm(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );
    };

    const ownerUsers = useMemo(
        () =>
            users.filter(
                (user) =>
                    user.role === "OWNER"
            ),
        [users]
    );

    const handleCreateStore = async (e) => {

        e.preventDefault();

        setFormMessage("");
        setFormError("");

        if (!storeForm.ownerId) {

            setFormError(
                "Please select a store owner."
            );

            return;
        }

        try {

            setFormLoading(true);

            const response =
                await api.post(
                    "/admin/stores",
                    {
                        name: storeForm.name,
                        email: storeForm.email,
                        address: storeForm.address,
                        ownerId:
                            Number(
                                storeForm.ownerId
                            )
                    }
                );

            setFormMessage(
                response.data.message ||
                "Store created successfully."
            );

            setStoreForm(
                emptyStoreForm
            );

            await Promise.all([
                fetchStores(),
                fetchDashboard()
            ]);

            setTimeout(() => {

                setShowStoreModal(false);

                setFormMessage("");

            }, 900);

        } catch (err) {

            console.error(
                "Create store error:",
                err
            );

            setFormError(
                err.response?.data?.message ||
                "Failed to create store."
            );

        } finally {

            setFormLoading(false);
        }
    };
    // User Details

    const openUserDetails =
        async (userId) => {

            try {

                setSelectedUser({
                    loading: true
                });

                const response =
                    await api.get(
                        `/admin/users/${userId}`
                    );

                setSelectedUser(
                    response.data.data
                );

            } catch (err) {

                console.error(
                    "User details error:",
                    err
                );

                setSelectedUser({
                    error:
                        err.response?.data?.message ||
                        "Failed to load user details."
                });
            }
        };
    // Account Menu

    const openProfileModal = () => {

        setShowAccountMenu(false);

        setShowProfileModal(true);
    };

    const closeProfileModal = () => {

        setShowProfileModal(false);
    };
    // Logout

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "userInfo"
        );

        window.location.href =
            "/login";
    };
    // Filter Helpers

    const updateUserFilter = (
        name,
        value
    ) => {

        setUserFilters(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );
    };

    const updateStoreFilter = (
        name,
        value
    ) => {

        setStoreFilters(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );
    };

    const resetUserFilters = () => {

        setUserFilters({
            name: "",
            email: "",
            address: "",
            role: "",
            sortBy: "name",
            sortOrder: "asc"
        });
    };

    const resetStoreFilters = () => {

        setStoreFilters({
            name: "",
            email: "",
            address: "",
            sortBy: "name",
            sortOrder: "asc"
        });
    };
    // Modal Helpers

    const closeUserModal = () => {

        if (formLoading) return;

        setShowUserModal(false);

        setUserForm(
            emptyUserForm
        );

        setFormMessage("");
        setFormError("");
    };

    const closeStoreModal = () => {

        if (formLoading) return;

        setShowStoreModal(false);

        setStoreForm(
            emptyStoreForm
        );

        setFormMessage("");
        setFormError("");
    };
    // Stars

    const stars = (rating) => {

        const value =
            Math.round(
                Number(
                    rating || 0
                )
            );

        return "★★★★★"
            .split("")
            .map(
                (
                    star,
                    index
                ) => (

                    <span
                        key={index}
                        className={
                            index < value
                                ? "admin-star active"
                                : "admin-star"
                        }
                    >
                        {star}
                    </span>
                )
            );
    };
    // Loading

    if (loading) {

        return (
            <div className="admin-page">

                <div className="admin-loading">

                    <div className="admin-spinner"></div>

                    <h2>
                        Loading Admin Portal
                    </h2>

                    <p>
                        Preparing your dashboard...
                    </p>

                </div>

            </div>
        );
    }
    // Main Ui

    return (

        <div className="admin-page">
            {/* Sidebar */}

            <aside className="admin-sidebar">

                <div className="admin-brand">

                    <div className="admin-brand-icon">
                        ★
                    </div>

                    <div>
                        <strong>
                            RateHub
                        </strong>

                        <span>
                            ADMIN PORTAL
                        </span>
                    </div>

                </div>

                <nav className="admin-nav">

                    <button
                        className={
                            activeTab === "overview"
                                ? "admin-nav-item active"
                                : "admin-nav-item"
                        }
                        onClick={() =>
                            setActiveTab(
                                "overview"
                            )
                        }
                    >
                        <span>⌂</span>
                        Overview
                    </button>

                    <button
                        className={
                            activeTab === "users"
                                ? "admin-nav-item active"
                                : "admin-nav-item"
                        }
                        onClick={() =>
                            setActiveTab(
                                "users"
                            )
                        }
                    >
                        <span>◉</span>
                        Users

                        <small>
                            {stats.totalUsers}
                        </small>
                    </button>

                    <button
                        className={
                            activeTab === "stores"
                                ? "admin-nav-item active"
                                : "admin-nav-item"
                        }
                        onClick={() =>
                            setActiveTab(
                                "stores"
                            )
                        }
                    >
                        <span>▣</span>
                        Stores

                        <small>
                            {stats.totalStores}
                        </small>
                    </button>

                </nav>

                <div className="admin-sidebar-bottom">

                    <div className="admin-security-note">

                        <span>✓</span>

                        <div>

                            <strong>
                                Secure session
                            </strong>

                            <small>
                                Administrator access
                            </small>

                        </div>

                    </div>

                    <button
                        className="admin-logout"
                        onClick={
                            handleLogout
                        }
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>
            {/* Main */}

            <main className="admin-main">
            {/* Top Bar */}

                <header className="admin-topbar">

                    <div>

                        <span className="admin-eyebrow">
                            SYSTEM ADMINISTRATION
                        </span>

                        <h1>
                            {activeTab ===
                                "overview"
                                ? "Dashboard"
                                : activeTab ===
                                    "users"
                                    ? "User Management"
                                    : "Store Management"}
                        </h1>

                    </div>

                    {/* ADMIN ACCOUNT */}

                    <div className="admin-account-container">

                        <button
                            type="button"
                            className="admin-account-button"
                            onClick={() =>
                                setShowAccountMenu(
                                    !showAccountMenu
                                )
                            }
                        >

                            <div className="admin-avatar">

                                {adminName
                                    .charAt(0)
                                    .toUpperCase()}

                            </div>

                            <div className="admin-profile">

                                <strong>
                                    {adminName}
                                </strong>

                                <span>
                                    System Admin
                                </span>

                            </div>

                            <span className="admin-account-arrow">
                                ▾
                            </span>

                        </button>

                        {/* ACCOUNT DROPDOWN */}

                        {showAccountMenu && (

                            <div className="admin-account-menu">

                                <div className="admin-menu-header">

                                    <div className="admin-menu-avatar">

                                        {adminName
                                            .charAt(0)
                                            .toUpperCase()}

                                    </div>

                                    <div>

                                        <strong>
                                            {adminName}
                                        </strong>

                                        <span>
                                            {adminEmail}
                                        </span>

                                    </div>

                                </div>

                                <div className="admin-menu-divider" />

                                <button
                                    type="button"
                                    onClick={
                                        openProfileModal
                                    }
                                >
                                    <span>
                                        👤
                                    </span>

                                    My Profile
                                </button>

                                <div className="admin-menu-divider" />

                                <button
                                    type="button"
                                    className="admin-menu-logout"
                                    onClick={
                                        handleLogout
                                    }
                                >
                                    <span>
                                        ↪
                                    </span>

                                    Logout
                                </button>

                            </div>

                        )}

                    </div>

                </header>

                {error && (

                    <div className="admin-alert error">

                        <span>!</span>

                        {error}

                    </div>

                )}
            {/* Overview */}

                {activeTab ===
                    "overview" && (

                        <section className="admin-content">

                            <div className="admin-welcome">

                                <div>

                                    <span>
                                        WELCOME BACK
                                    </span>

                                    <h2>
                                        Manage your platform
                                    </h2>

                                    <p>
                                        Monitor users, stores and
                                        customer ratings from one place.
                                    </p>

                                </div>

                                <div className="admin-welcome-icon">
                                    ★
                                </div>

                            </div>

                            <div className="admin-stat-grid">

                                <div className="admin-stat-card blue">

                                    <div className="admin-stat-icon">
                                        ◉
                                    </div>

                                    <div>

                                        <span>
                                            Total Users
                                        </span>

                                        <strong>
                                            {stats.totalUsers}
                                        </strong>

                                        <small>
                                            Registered accounts
                                        </small>

                                    </div>

                                </div>

                                <div className="admin-stat-card purple">

                                    <div className="admin-stat-icon">
                                        ▣
                                    </div>

                                    <div>

                                        <span>
                                            Total Stores
                                        </span>

                                        <strong>
                                            {stats.totalStores}
                                        </strong>

                                        <small>
                                            Stores on platform
                                        </small>

                                    </div>

                                </div>

                                <div className="admin-stat-card orange">

                                    <div className="admin-stat-icon">
                                        ★
                                    </div>

                                    <div>

                                        <span>
                                            Total Ratings
                                        </span>

                                        <strong>
                                            {stats.totalRatings}
                                        </strong>

                                        <small>
                                            Customer submissions
                                        </small>

                                    </div>

                                </div>

                            </div>

                            <div className="admin-quick-grid">

                                <button
                                    className="admin-quick-card"
                                    onClick={() =>
                                        setActiveTab(
                                            "users"
                                        )
                                    }
                                >

                                    <div className="quick-icon blue-bg">
                                        ◉
                                    </div>

                                    <div>

                                        <strong>
                                            Manage Users
                                        </strong>

                                        <span>
                                            Search, filter and view users
                                        </span>

                                    </div>

                                    <b>→</b>

                                </button>

                                <button
                                    className="admin-quick-card"
                                    onClick={() =>
                                        setActiveTab(
                                            "stores"
                                        )
                                    }
                                >

                                    <div className="quick-icon purple-bg">
                                        ▣
                                    </div>

                                    <div>

                                        <strong>
                                            Manage Stores
                                        </strong>

                                        <span>
                                            View and manage registered stores
                                        </span>

                                    </div>

                                    <b>→</b>

                                </button>

                            </div>

                        </section>
                    )}
            {/* Users */}

                {activeTab ===
                    "users" && (

                        <section className="admin-content">

                            <div className="admin-section-header">

                                <div>

                                    <span>
                                        PLATFORM USERS
                                    </span>

                                    <h2>
                                        All Users
                                    </h2>

                                    <p>
                                        Manage registered users and administrators.
                                    </p>

                                </div>

                                <button
                                    className="admin-primary-btn"
                                    onClick={() => {

                                        setFormError("");
                                        setFormMessage("");

                                        setShowUserModal(
                                            true
                                        );

                                    }}
                                >
                                    + Add User
                                </button>

                            </div>

                            <div className="admin-filter-card">

                                <div className="filter-search">

                                    <label>
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={
                                            userFilters.name
                                        }
                                        onChange={(e) =>
                                            updateUserFilter(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="filter-search">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Search by email..."
                                        value={
                                            userFilters.email
                                        }
                                        onChange={(e) =>
                                            updateUserFilter(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="filter-search">

                                    <label>
                                        Address
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Search address..."
                                        value={
                                            userFilters.address
                                        }
                                        onChange={(e) =>
                                            updateUserFilter(
                                                "address",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="filter-select">

                                    <label>
                                        Role
                                    </label>

                                    <select
                                        value={
                                            userFilters.role
                                        }
                                        onChange={(e) =>
                                            updateUserFilter(
                                                "role",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            All roles
                                        </option>

                                        <option value="USER">
                                            User
                                        </option>

                                        <option value="OWNER">
                                            Owner
                                        </option>

                                        <option value="ADMIN">
                                            Admin
                                        </option>

                                    </select>

                                </div>

                                <div className="filter-select">

                                    <label>
                                        Sort By
                                    </label>

                                    <select
                                        value={
                                            userFilters.sortBy
                                        }
                                        onChange={(e) =>
                                            updateUserFilter(
                                                "sortBy",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="name">
                                            Name
                                        </option>

                                        <option value="email">
                                            Email
                                        </option>

                                        <option value="address">
                                            Address
                                        </option>

                                        <option value="role">
                                            Role
                                        </option>

                                    </select>

                                </div>

                                <button
                                    className="sort-btn"
                                    onClick={() =>
                                        updateUserFilter(
                                            "sortOrder",
                                            userFilters.sortOrder ===
                                                "asc"
                                                ? "desc"
                                                : "asc"
                                        )
                                    }
                                >

                                    {userFilters.sortOrder ===
                                        "asc"
                                        ? "↑ Ascending"
                                        : "↓ Descending"}

                                </button>

                                <button
                                    className="reset-btn"
                                    onClick={
                                        resetUserFilters
                                    }
                                >
                                    Reset
                                </button>

                            </div>

                            <div className="admin-table-card">

                                <div className="admin-table-header">

                                    <div>

                                        <strong>
                                            Users
                                        </strong>

                                        <span>
                                            {users.length} results
                                        </span>

                                    </div>

                                    {usersLoading && (

                                        <span className="table-loading">
                                            Updating...
                                        </span>

                                    )}

                                </div>

                                <div className="admin-table-scroll">

                                    <table className="admin-table">

                                        <thead>

                                            <tr>
                                                <th>User</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                <th>Role</th>
                                                <th>Action</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {users.length ===
                                                0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="5"
                                                        className="table-empty"
                                                    >
                                                        No users found.
                                                    </td>

                                                </tr>

                                            ) : (

                                                users.map(
                                                    (user) => (

                                                        <tr
                                                            key={
                                                                user.id
                                                            }
                                                        >

                                                            <td>

                                                                <div className="table-user">

                                                                    <div className="mini-avatar">

                                                                        {(
                                                                            user.name ||
                                                                            "U"
                                                                        )
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}

                                                                    </div>

                                                                    <div>

                                                                        <strong>
                                                                            {user.name}
                                                                        </strong>

                                                                        <small>
                                                                            ID #
                                                                            {
                                                                                user.id
                                                                            }
                                                                        </small>

                                                                    </div>

                                                                </div>

                                                            </td>

                                                            <td>
                                                                {
                                                                    user.email
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    user.address ||
                                                                    "—"
                                                                }
                                                            </td>

                                                            <td>

                                                                <span
                                                                    className={`role-badge ${String(
                                                                        user.role
                                                                    ).toLowerCase()}`}
                                                                >
                                                                    {
                                                                        user.role
                                                                    }
                                                                </span>

                                                            </td>

                                                            <td>

                                                                <button
                                                                    className="view-btn"
                                                                    onClick={() =>
                                                                        openUserDetails(
                                                                            user.id
                                                                        )
                                                                    }
                                                                >
                                                                    View Details
                                                                </button>

                                                            </td>

                                                        </tr>

                                                    )
                                                )

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </section>

                    )}
            {/* Stores */}

                {activeTab ===
                    "stores" && (

                        <section className="admin-content">

                            <div className="admin-section-header">

                                <div>

                                    <span>
                                        BUSINESS DIRECTORY
                                    </span>

                                    <h2>
                                        All Stores
                                    </h2>

                                    <p>
                                        Manage stores registered on the platform.
                                    </p>

                                </div>

                                <button
                                    className="admin-primary-btn"
                                    onClick={() => {

                                        setFormError("");
                                        setFormMessage("");

                                        setShowStoreModal(
                                            true
                                        );

                                    }}
                                >
                                    + Add Store
                                </button>

                            </div>

                            <div className="admin-filter-card">

                                <div className="filter-search">

                                    <label>
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Search store..."
                                        value={
                                            storeFilters.name
                                        }
                                        onChange={(e) =>
                                            updateStoreFilter(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="filter-search">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Search email..."
                                        value={
                                            storeFilters.email
                                        }
                                        onChange={(e) =>
                                            updateStoreFilter(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="filter-search">

                                    <label>
                                        Address
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Search address..."
                                        value={
                                            storeFilters.address
                                        }
                                        onChange={(e) =>
                                            updateStoreFilter(
                                                "address",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="filter-select">

                                    <label>
                                        Sort By
                                    </label>

                                    <select
                                        value={
                                            storeFilters.sortBy
                                        }
                                        onChange={(e) =>
                                            updateStoreFilter(
                                                "sortBy",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="name">
                                            Name
                                        </option>

                                        <option value="email">
                                            Email
                                        </option>

                                        <option value="address">
                                            Address
                                        </option>

                                        <option value="rating">
                                            Rating
                                        </option>

                                    </select>

                                </div>

                                <button
                                    className="sort-btn"
                                    onClick={() =>
                                        updateStoreFilter(
                                            "sortOrder",
                                            storeFilters.sortOrder ===
                                                "asc"
                                                ? "desc"
                                                : "asc"
                                        )
                                    }
                                >

                                    {storeFilters.sortOrder ===
                                        "asc"
                                        ? "↑ Ascending"
                                        : "↓ Descending"}

                                </button>

                                <button
                                    className="reset-btn"
                                    onClick={
                                        resetStoreFilters
                                    }
                                >
                                    Reset
                                </button>

                            </div>

                            <div className="admin-table-card">

                                <div className="admin-table-header">

                                    <div>

                                        <strong>
                                            Stores
                                        </strong>

                                        <span>
                                            {stores.length} results
                                        </span>

                                    </div>

                                    {storesLoading && (

                                        <span className="table-loading">
                                            Updating...
                                        </span>

                                    )}

                                </div>

                                <div className="admin-table-scroll">

                                    <table className="admin-table">

                                        <thead>

                                            <tr>
                                                <th>Store</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                <th>Rating</th>
                                                <th>Owner ID</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {stores.length ===
                                                0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="5"
                                                        className="table-empty"
                                                    >
                                                        No stores found.
                                                    </td>

                                                </tr>

                                            ) : (

                                                stores.map(
                                                    (store) => (

                                                        <tr
                                                            key={
                                                                store.id
                                                            }
                                                        >

                                                            <td>

                                                                <div className="table-user">

                                                                    <div className="store-mini-icon">
                                                                        ▣
                                                                    </div>

                                                                    <div>

                                                                        <strong>
                                                                            {
                                                                                store.name
                                                                            }
                                                                        </strong>

                                                                        <small>
                                                                            ID #
                                                                            {
                                                                                store.id
                                                                            }
                                                                        </small>

                                                                    </div>

                                                                </div>

                                                            </td>

                                                            <td>
                                                                {
                                                                    store.email
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    store.address
                                                                }
                                                            </td>

                                                            <td>

                                                                <div className="table-rating">

                                                                    <strong>
                                                                        {Number(
                                                                            store.overall_rating ||
                                                                            0
                                                                        ).toFixed(
                                                                            1
                                                                        )}
                                                                    </strong>

                                                                    <span>
                                                                        {stars(
                                                                            store.overall_rating
                                                                        )}
                                                                    </span>

                                                                </div>

                                                            </td>

                                                            <td>
                                                                #
                                                                {
                                                                    store.owner_id
                                                                }
                                                            </td>

                                                        </tr>

                                                    )
                                                )

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </section>

                    )}

            </main>
            {/* Add User Modal */}

            {showUserModal && (

                <div
                    className="admin-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeUserModal();
                        }

                    }}
                >

                    <div className="admin-modal">

                        <div className="modal-header">

                            <div>

                                <span>
                                    USER MANAGEMENT
                                </span>

                                <h2>
                                    Add New User
                                </h2>

                            </div>

                            <button
                                className="modal-close"
                                onClick={
                                    closeUserModal
                                }
                            >
                                ×
                            </button>

                        </div>

                        {formMessage && (

                            <div className="admin-alert success">
                                ✓ {formMessage}
                            </div>

                        )}

                        {formError && (

                            <div className="admin-alert error">
                                ! {formError}
                            </div>

                        )}

                        <form
                            onSubmit={
                                handleCreateUser
                            }
                            className="admin-form"
                        >

                            <div className="form-two-column">

                                <div className="admin-field">

                                    <label>
                                        Name
                                    </label>

                                    <input
                                        name="name"
                                        value={
                                            userForm.name
                                        }
                                        onChange={
                                            handleUserChange
                                        }
                                        placeholder="Minimum 20 characters"
                                        required
                                    />

                                    <small>
                                        {
                                            userForm
                                                .name
                                                .length
                                        }
                                        /60
                                    </small>

                                </div>

                                <div className="admin-field">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            userForm.email
                                        }
                                        onChange={
                                            handleUserChange
                                        }
                                        placeholder="user@example.com"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="form-two-column">

                                <div className="admin-field">

                                    <label>
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={
                                            userForm.password
                                        }
                                        onChange={
                                            handleUserChange
                                        }
                                        placeholder="8-16 characters"
                                        required
                                    />

                                </div>

                                <div className="admin-field">

                                    <label>
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        value={
                                            userForm.role
                                        }
                                        onChange={
                                            handleUserChange
                                        }
                                    >

                                        <option value="USER">
                                            Normal User
                                        </option>

                                        <option value="ADMIN">
                                            Administrator
                                        </option>

                                    </select>

                                </div>

                            </div>

                            <div className="admin-field">

                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={
                                        userForm.address
                                    }
                                    onChange={
                                        handleUserChange
                                    }
                                    maxLength="400"
                                    rows="3"
                                    placeholder="Enter address..."
                                />

                                <small>
                                    {
                                        userForm
                                            .address
                                            .length
                                    }
                                    /400
                                </small>

                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="admin-secondary-btn"
                                    onClick={
                                        closeUserModal
                                    }
                                    disabled={
                                        formLoading
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-primary-btn"
                                    disabled={
                                        formLoading
                                    }
                                >
                                    {formLoading
                                        ? "Creating..."
                                        : "Create User"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}
            {/* Add Store Modal */}

            {showStoreModal && (

                <div
                    className="admin-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeStoreModal();
                        }

                    }}
                >

                    <div className="admin-modal">

                        <div className="modal-header">

                            <div>

                                <span>
                                    BUSINESS MANAGEMENT
                                </span>

                                <h2>
                                    Add New Store
                                </h2>

                            </div>

                            <button
                                className="modal-close"
                                onClick={
                                    closeStoreModal
                                }
                            >
                                ×
                            </button>

                        </div>

                        {formMessage && (

                            <div className="admin-alert success">
                                ✓ {formMessage}
                            </div>

                        )}

                        {formError && (

                            <div className="admin-alert error">
                                ! {formError}
                            </div>

                        )}

                        <form
                            onSubmit={
                                handleCreateStore
                            }
                            className="admin-form"
                        >

                            <div className="admin-field">

                                <label>
                                    Store Name
                                </label>

                                <input
                                    name="name"
                                    value={
                                        storeForm.name
                                    }
                                    onChange={
                                        handleStoreChange
                                    }
                                    placeholder="Store name"
                                    required
                                />

                            </div>

                            <div className="admin-field">

                                <label>
                                    Store Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        storeForm.email
                                    }
                                    onChange={
                                        handleStoreChange
                                    }
                                    placeholder="store@example.com"
                                    required
                                />

                            </div>

                            <div className="admin-field">

                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={
                                        storeForm.address
                                    }
                                    onChange={
                                        handleStoreChange
                                    }
                                    maxLength="400"
                                    rows="3"
                                    placeholder="Store address..."
                                    required
                                />

                            </div>

                            <div className="admin-field">

                                <label>
                                    Store Owner
                                </label>

                                <select
                                    name="ownerId"
                                    value={
                                        storeForm.ownerId
                                    }
                                    onChange={
                                        handleStoreChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select an owner
                                    </option>

                                    {ownerUsers.length ===
                                        0 ? (

                                        <option disabled>
                                            No owners available
                                        </option>

                                    ) : (

                                        ownerUsers.map(
                                            (owner) => (

                                                <option
                                                    key={
                                                        owner.id
                                                    }
                                                    value={
                                                        owner.id
                                                    }
                                                >
                                                    {
                                                        owner.name
                                                    }
                                                    {" — "}
                                                    {
                                                        owner.email
                                                    }
                                                </option>

                                            )
                                        )

                                    )}

                                </select>

                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="admin-secondary-btn"
                                    onClick={
                                        closeStoreModal
                                    }
                                    disabled={
                                        formLoading
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-primary-btn"
                                    disabled={
                                        formLoading
                                    }
                                >
                                    {formLoading
                                        ? "Creating..."
                                        : "Create Store"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}
            {/* User Details Modal */}

            {selectedUser && (

                <div
                    className="admin-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            setSelectedUser(
                                null
                            );
                        }

                    }}
                >

                    <div className="admin-modal details-modal">

                        <div className="modal-header">

                            <div>

                                <span>
                                    USER PROFILE
                                </span>

                                <h2>
                                    User Details
                                </h2>

                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setSelectedUser(
                                        null
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>

                        {selectedUser.loading ? (

                            <div className="modal-loading">

                                <div className="admin-spinner"></div>

                                Loading details...

                            </div>

                        ) : selectedUser.error ? (

                            <div className="admin-alert error">

                                ! {selectedUser.error}

                            </div>

                        ) : (

                            <>

                                <div className="detail-profile">

                                    <div className="detail-avatar">

                                        {(selectedUser.name ||
                                            "U")
                                            .charAt(0)
                                            .toUpperCase()}

                                    </div>

                                    <div>

                                        <h3>
                                            {
                                                selectedUser.name
                                            }
                                        </h3>

                                        <span
                                            className={`role-badge ${String(
                                                selectedUser.role
                                            ).toLowerCase()}`}
                                        >
                                            {
                                                selectedUser.role
                                            }
                                        </span>

                                    </div>

                                </div>

                                <div className="detail-grid">

                                    <div>

                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {
                                                selectedUser.email
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Address
                                        </span>

                                        <strong>
                                            {
                                                selectedUser.address ||
                                                "Not provided"
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            User ID
                                        </span>

                                        <strong>
                                            #
                                            {
                                                selectedUser.id
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Role
                                        </span>

                                        <strong>
                                            {
                                                selectedUser.role
                                            }
                                        </strong>

                                    </div>

                                </div>

                                {selectedUser.stores &&
                                    selectedUser.stores.length >
                                    0 && (

                                        <div className="owner-store-details">

                                            <h3>
                                                Owned Stores
                                            </h3>

                                            {
                                                selectedUser.stores.map(
                                                    (
                                                        store
                                                    ) => (

                                                        <div
                                                            className="owner-store-row"
                                                            key={
                                                                store.id
                                                            }
                                                        >

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        store.name
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        store.email
                                                                    }
                                                                </span>

                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {Number(
                                                                        store.average_rating ||
                                                                        0
                                                                    ).toFixed(
                                                                        1
                                                                    )}
                                                                </strong>

                                                                <span>
                                                                    ★ Rating
                                                                </span>

                                                            </div>

                                                        </div>

                                                    )
                                                )
                                            }

                                        </div>

                                    )}

                            </>

                        )}

                    </div>

                </div>

            )}
            {/* Admin Profile Modal */}

            {showProfileModal && (

                <div
                    className="admin-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeProfileModal();
                        }

                    }}
                >

                    <div className="admin-modal">

                        <div className="modal-header">

                            <div>

                                <span>
                                    ADMINISTRATOR PROFILE
                                </span>

                                <h2>
                                    My Profile
                                </h2>

                            </div>

                            <button
                                className="modal-close"
                                onClick={
                                    closeProfileModal
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="admin-profile-large">

                            <div className="admin-profile-large-avatar">

                                {adminName
                                    .charAt(0)
                                    .toUpperCase()}

                            </div>

                            <div>

                                <h3>
                                    {adminName}
                                </h3>

                                <span>
                                    System Administrator
                                </span>

                            </div>

                        </div>

                        <div className="admin-profile-details">

                            <div>

                                <span>
                                    NAME
                                </span>

                                <strong>
                                    {adminName}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    EMAIL
                                </span>

                                <strong>
                                    {adminEmail}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    ADDRESS
                                </span>

                                <strong>
                                    {adminAddress}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    ROLE
                                </span>

                                <strong>
                                    ADMIN
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminDashboard;
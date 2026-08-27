import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "../css/AdminDashboard.css";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminOverview from "../components/admin/AdminOverview";
import AdminUsers from "../components/admin/AdminUsers";
import AdminStores from "../components/admin/AdminStores";
import AddUserModal from "../components/admin/AddUserModal";
import AddStoreModal from "../components/admin/AddStoreModal";
import UserDetailsModal from "../components/admin/UserDetailsModal";
import AdminProfileModal from "../components/admin/AdminProfileModal";

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
    const [showUserModal, setShowUserModal] =
        useState(false);

    const [showStoreModal, setShowStoreModal] =
        useState(false);

    const [selectedUser, setSelectedUser] =
        useState(null);

    // Forms
    const [userForm, setUserForm] =
        useState(emptyUserForm);

    const [storeForm, setStoreForm] =
        useState(emptyStoreForm);

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

    const closeUserDetails = () => {
        setSelectedUser(null);
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

        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");

        window.location.href = "/login";
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

    // Main UI
    return (

        <div className="admin-page">

            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                totalUsers={stats.totalUsers}
                totalStores={stats.totalStores}
                onLogout={handleLogout}
            />


            <main className="admin-main">

                <AdminHeader
                    activeTab={activeTab}
                    adminName={adminName}
                    adminEmail={adminEmail}
                    setShowAccountMenu={
                        setShowAccountMenu
                    }
                    showAccountMenu={
                        showAccountMenu
                    }
                    openProfileModal={
                        openProfileModal
                    }
                    handleLogout={
                        handleLogout
                    }
                />


                {error && (

                    <div className="admin-alert error">

                        <span>
                            !
                        </span>

                        {error}

                    </div>

                )}


                {activeTab === "overview" && (

                    <AdminOverview
                        stats={stats}
                        setActiveTab={setActiveTab}
                    />

                )}


                {activeTab === "users" && (

                    <AdminUsers
                        users={users}
                        usersLoading={usersLoading}
                        userFilters={userFilters}
                        updateUserFilter={
                            updateUserFilter
                        }
                        resetUserFilters={
                            resetUserFilters
                        }
                        openUserDetails={
                            openUserDetails
                        }
                        onAddUser={() => {

                            setFormError("");
                            setFormMessage("");
                            setShowUserModal(true);

                        }}
                    />

                )}


                {activeTab === "stores" && (

                    <AdminStores
                        stores={stores}
                        storesLoading={storesLoading}
                        storeFilters={storeFilters}
                        updateStoreFilter={
                            updateStoreFilter
                        }
                        resetStoreFilters={
                            resetStoreFilters
                        }
                        stars={stars}
                        onAddStore={() => {

                            setFormError("");
                            setFormMessage("");
                            setShowStoreModal(true);

                        }}
                    />

                )}

            </main>


            <AddUserModal
                show={showUserModal}
                formLoading={formLoading}
                formMessage={formMessage}
                formError={formError}
                userForm={userForm}
                handleUserChange={
                    handleUserChange
                }
                handleCreateUser={
                    handleCreateUser
                }
                closeUserModal={
                    closeUserModal
                }
            />


            <AddStoreModal
                show={showStoreModal}
                formLoading={formLoading}
                formMessage={formMessage}
                formError={formError}
                storeForm={storeForm}
                handleStoreChange={
                    handleStoreChange
                }
                handleCreateStore={
                    handleCreateStore
                }
                closeStoreModal={
                    closeStoreModal
                }
                ownerUsers={ownerUsers}
            />


            <UserDetailsModal
                selectedUser={selectedUser}
                closeUserDetails={
                    closeUserDetails
                }
            />


            <AdminProfileModal
                show={showProfileModal}
                adminName={adminName}
                adminEmail={adminEmail}
                adminAddress={adminAddress}
                closeProfileModal={
                    closeProfileModal
                }
            />

        </div>
    );
};

export default AdminDashboard;
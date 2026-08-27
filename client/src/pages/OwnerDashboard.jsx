import { useEffect, useState } from "react";
import api from "../services/api";

import OwnerAccountBar from "../components/owner/OwnerAccountBar";
import OwnerHero from "../components/owner/OwnerHero";
import OwnerStores from "../components/owner/OwnerStores";
import StoreEditForm from "../components/owner/StoreEditForm";
import RatingUsers from "../components/owner/RatingUsers";
import OwnerProfileModal from "../components/owner/OwnerProfileModal";
import ChangePasswordModal from "../components/owner/ChangePasswordModal";

const OwnerDashboard = () => {

    // Dashboard
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Store Editing
    const [editingStore, setEditingStore] =
        useState(null);

    const [storeForm, setStoreForm] = useState({
        name: "",
        email: "",
        address: ""
    });

    const [storeMessage, setStoreMessage] =
        useState("");

    const [storeError, setStoreError] =
        useState("");

    const [savingStore, setSavingStore] =
        useState(false);

    // Password
    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [passwordMessage, setPasswordMessage] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");

    const [changingPassword, setChangingPassword] =
        useState(false);

    // Account Menu / Modals
    const [showAccountMenu, setShowAccountMenu] =
        useState(false);

    const [showProfileModal, setShowProfileModal] =
        useState(false);

    const [showPasswordModal, setShowPasswordModal] =
        useState(false);

    // User Information
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

    const ownerName =
        storedUser.name || "Store Owner";

    const ownerEmail =
        storedUser.email || "owner@example.com";

    const ownerAddress =
        storedUser.address ||
        "Pune, Maharashtra";


    // Fetch Dashboard
    const fetchDashboard = async () => {

        try {

            setError("");

            const response =
                await api.get(
                    "/owner/dashboard"
                );

            setDashboard(
                response.data.data
            );

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


    // Store Editing
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
            [e.target.name]:
                e.target.value
        });

    };


    const handleStoreUpdate = async (e) => {

        e.preventDefault();

        setStoreMessage("");
        setStoreError("");

        try {

            setSavingStore(true);

            const response =
                await api.put(
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


    // Change Password
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

        if (
            newPassword !==
            confirmPassword
        ) {

            setPasswordError(
                "New passwords do not match"
            );

            return;
        }

        try {

            setChangingPassword(true);

            const response =
                await api.put(
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


    // Password Modal
    const openPasswordModal = () => {

        setShowAccountMenu(false);

        setPasswordMessage("");
        setPasswordError("");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setShowPasswordModal(true);

    };


    const closePasswordModal = () => {

        if (changingPassword) {
            return;
        }

        setShowPasswordModal(false);

        setPasswordMessage("");
        setPasswordError("");

    };


    // Profile Modal
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


    // Loading
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


    // Error
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


    // Data
    const stores =
        dashboard?.stores || [];

    const ratingUsers =
        dashboard?.ratingUsers || [];


    // Main UI
    return (

        <div className="page-shell">

            <OwnerAccountBar
                ownerName={ownerName}
                ownerEmail={ownerEmail}
                showAccountMenu={
                    showAccountMenu
                }
                setShowAccountMenu={
                    setShowAccountMenu
                }
                openProfileModal={
                    openProfileModal
                }
                openPasswordModal={
                    openPasswordModal
                }
                handleLogout={
                    handleLogout
                }
            />


            <OwnerHero
                storeCount={
                    stores.length
                }
            />


            {storeMessage && (

                <div className="alert success-alert">

                    <span>
                        ✓
                    </span>

                    {storeMessage}

                </div>

            )}


            <OwnerStores
                stores={stores}
                startEditing={startEditing}
            />


            <StoreEditForm
                editingStore={
                    editingStore
                }
                storeForm={storeForm}
                storeError={storeError}
                savingStore={savingStore}
                handleStoreChange={
                    handleStoreChange
                }
                handleStoreUpdate={
                    handleStoreUpdate
                }
                cancelEditing={
                    cancelEditing
                }
            />


            <RatingUsers
                ratingUsers={
                    ratingUsers
                }
            />


            <OwnerProfileModal
                show={
                    showProfileModal
                }
                ownerName={
                    ownerName
                }
                ownerEmail={
                    ownerEmail
                }
                ownerAddress={
                    ownerAddress
                }
                closeProfileModal={
                    closeProfileModal
                }
            />


            <ChangePasswordModal
                show={
                    showPasswordModal
                }
                currentPassword={
                    currentPassword
                }
                newPassword={
                    newPassword
                }
                confirmPassword={
                    confirmPassword
                }
                passwordMessage={
                    passwordMessage
                }
                passwordError={
                    passwordError
                }
                changingPassword={
                    changingPassword
                }
                setCurrentPassword={
                    setCurrentPassword
                }
                setNewPassword={
                    setNewPassword
                }
                setConfirmPassword={
                    setConfirmPassword
                }
                handleChangePassword={
                    handleChangePassword
                }
                closePasswordModal={
                    closePasswordModal
                }
            />

        </div>

    );
};

export default OwnerDashboard;
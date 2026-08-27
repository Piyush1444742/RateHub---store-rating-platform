import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/UserDashboard.css";

import UserSidebar from "../components/user/UserSidebar";
import UserHeader from "../components/user/UserHeader";
import UserHero from "../components/user/UserHero";
import StoreSearch from "../components/user/StoreSearch";
import StoreList from "../components/user/StoreList";
import UserProfileModal from "../components/user/UserProfileModal";
import UserPasswordModal from "../components/user/UserPasswordModal";

const UserDashboard = () => {

    const navigate = useNavigate();

    // Stores
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // Account
    const [showAccountMenu, setShowAccountMenu] =
        useState(false);

    const [showProfile, setShowProfile] =
        useState(false);

    const [showPasswordModal, setShowPasswordModal] =
        useState(false);

    // Password
    const [passwordData, setPasswordData] =
        useState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

    const [passwordLoading, setPasswordLoading] =
        useState(false);

    const [passwordMessage, setPasswordMessage] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");


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

    const userName =
        storedUser.name || "Customer";

    const userEmail =
        storedUser.email || "RateHub User";

    const userAddress =
        storedUser.address ||
        "Address not available";


    // Fetch Stores
    useEffect(() => {

        const fetchStores = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/user/stores?search=${encodeURIComponent(
                            search
                        )}`
                    );

                setStores(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Fetch stores error:",
                    error
                );

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


    // Rating
    const handleRatingChange = async (
        storeId,
        ratingId,
        newRating
    ) => {

        if (!newRating) return;

        try {

            if (ratingId) {

                await api.put(
                    `/ratings/${ratingId}`,
                    {
                        rating:
                            Number(newRating)
                    }
                );

            } else {

                await api.post(
                    "/ratings",
                    {
                        storeId,
                        rating:
                            Number(newRating)
                    }
                );

            }


            const response =
                await api.get(
                    `/user/stores?search=${encodeURIComponent(
                        search
                    )}`
                );

            setStores(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Rating error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to submit rating"
            );

        }

    };


    // Stars
    const renderStars = (rating) => {

        const value =
            Number(rating) || 0;

        return (

            <div className="stars">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        <span
                            key={star}
                            className={
                                star <=
                                Math.round(
                                    value
                                )
                                    ? "star filled"
                                    : "star"
                            }
                        >
                            ★
                        </span>

                    )
                )}

            </div>

        );

    };


    // Password Modal
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

        const {
            name,
            value
        } = e.target;

        setPasswordData(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );

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


        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            setPasswordError(
                "Please fill in all password fields."
            );

            return;

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            setPasswordError(
                "New password and confirm password do not match."
            );

            return;

        }


        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;


        if (
            !passwordRegex.test(
                newPassword
            )
        ) {

            setPasswordError(
                "Password must be 8-16 characters and contain at least one uppercase letter and one special character."
            );

            return;

        }


        try {

            setPasswordLoading(true);

            const response =
                await api.put(
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


    // Profile
    const openProfile = () => {

        setShowAccountMenu(false);
        setShowProfile(true);

    };


    const closeProfile = () => {

        setShowProfile(false);

    };


    // Logout
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    return (

        <div className="user-page">

            <UserSidebar
                handleLogout={
                    handleLogout
                }
            />


            <main className="user-main">

                <UserHeader
                    userName={userName}
                    userEmail={userEmail}
                    showAccountMenu={
                        showAccountMenu
                    }
                    setShowAccountMenu={
                        setShowAccountMenu
                    }
                    openProfile={
                        openProfile
                    }
                    openPasswordModal={
                        openPasswordModal
                    }
                    handleLogout={
                        handleLogout
                    }
                />


                <UserHero />


                <StoreSearch
                    search={search}
                    setSearch={setSearch}
                />


                {error && (

                    <div className="error-message">

                        <span>
                            !
                        </span>

                        {error}

                    </div>

                )}


                <StoreList
                    stores={stores}
                    loading={loading}
                    search={search}
                    setSearch={setSearch}
                    renderStars={
                        renderStars
                    }
                    handleRatingChange={
                        handleRatingChange
                    }
                />

            </main>


            <UserProfileModal
                showProfile={
                    showProfile
                }
                userName={
                    userName
                }
                userEmail={
                    userEmail
                }
                userAddress={
                    userAddress
                }
                closeProfile={
                    closeProfile
                }
            />


            <UserPasswordModal
                showPasswordModal={
                    showPasswordModal
                }
                passwordData={
                    passwordData
                }
                passwordLoading={
                    passwordLoading
                }
                passwordMessage={
                    passwordMessage
                }
                passwordError={
                    passwordError
                }
                handlePasswordChange={
                    handlePasswordChange
                }
                handlePasswordSubmit={
                    handlePasswordSubmit
                }
                closePasswordModal={
                    closePasswordModal
                }
            />

        </div>

    );
};

export default UserDashboard;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";

import api from "../services/api";

const initialForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    storeName: "",
    storeEmail: "",
    storeAddress: ""
};

const Register = () => {

    const navigate = useNavigate();

    const [accountType, setAccountType] =
        useState("");

    const [form, setForm] =
        useState(initialForm);

    const [errors, setErrors] =
        useState({});

    const [serverError, setServerError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =========================
    // ACCOUNT TYPE
    // =========================

    const chooseAccountType = (type) => {

        setAccountType(type);

        setErrors({});
        setServerError("");
        setSuccess("");

    };


    const goBackToAccountType = () => {

        if (loading) return;

        setAccountType("");

        setErrors({});
        setServerError("");
        setSuccess("");

    };


    // =========================
    // VALIDATION
    // =========================

    const validate = () => {

        const newErrors = {};

        const name =
            form.name.trim();

        const email =
            form.email.trim();

        const address =
            form.address.trim();


        // Name
        if (!name) {

            newErrors.name =
                "Name is required.";

        } else if (
            name.length < 20 ||
            name.length > 60
        ) {

            newErrors.name =
                "Name must be between 20 and 60 characters.";

        }


        // Email
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!email) {

            newErrors.email =
                "Email is required.";

        } else if (
            !emailRegex.test(email)
        ) {

            newErrors.email =
                "Please enter a valid email address.";

        }


        // Password
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;


        if (!form.password) {

            newErrors.password =
                "Password is required.";

        } else if (
            !passwordRegex.test(
                form.password
            )
        ) {

            newErrors.password =
                "Password must be 8-16 characters and contain at least one uppercase letter and one special character.";

        }


        // Confirm Password
        if (!form.confirmPassword) {

            newErrors.confirmPassword =
                "Please confirm your password.";

        } else if (
            form.password !==
            form.confirmPassword
        ) {

            newErrors.confirmPassword =
                "Passwords do not match.";

        }


        // Address
        if (!address) {

            newErrors.address =
                "Address is required.";

        } else if (
            address.length > 400
        ) {

            newErrors.address =
                "Address cannot exceed 400 characters.";

        }


        // Owner Store Validation
        if (accountType === "OWNER") {

            const storeName =
                form.storeName.trim();

            const storeEmail =
                form.storeEmail.trim();

            const storeAddress =
                form.storeAddress.trim();


            if (!storeName) {

                newErrors.storeName =
                    "Store name is required.";

            }


            if (!storeEmail) {

                newErrors.storeEmail =
                    "Store email is required.";

            } else if (
                !emailRegex.test(storeEmail)
            ) {

                newErrors.storeEmail =
                    "Please enter a valid store email.";

            }


            if (!storeAddress) {

                newErrors.storeAddress =
                    "Store address is required.";

            } else if (
                storeAddress.length > 400
            ) {

                newErrors.storeAddress =
                    "Store address cannot exceed 400 characters.";

            }

        }


        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );

    };


    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );


        setErrors(
            (previous) => ({
                ...previous,
                [name]: ""
            })
        );


        setServerError("");

    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setServerError("");
        setSuccess("");


        if (!accountType) {

            return;

        }


        if (!validate()) {

            return;

        }


        try {

            setLoading(true);


            const requestData = {

                name:
                    form.name.trim(),

                email:
                    form.email.trim(),

                password:
                    form.password,

                address:
                    form.address.trim(),

                accountType

            };


            if (
                accountType === "OWNER"
            ) {

                requestData.store = {

                    name:
                        form.storeName.trim(),

                    email:
                        form.storeEmail.trim(),

                    address:
                        form.storeAddress.trim()

                };

            }


            await api.post(
                "/auth/register",
                requestData
            );


            setSuccess(
                accountType === "OWNER"
                    ? "Owner registration successful! Redirecting to login..."
                    : "Registration successful! Redirecting to login..."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1200);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            setServerError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // ACCOUNT TYPE SCREEN
    // =========================

    if (!accountType) {

        return (

            <div className="register-page">

                <div className="register-card">


                    <div className="register-header">

                        <div className="register-logo">
                            ★
                        </div>

                        <div>

                            <h1>
                                RateHub
                            </h1>

                            <span>
                                STORE RATING PLATFORM
                            </span>

                        </div>

                    </div>


                    <div className="register-title">

                        <span className="register-label">
                            CREATE ACCOUNT
                        </span>

                        <h2>
                            Join RateHub
                        </h2>

                        <p>
                            How do you want to register?
                        </p>

                    </div>


                    <div className="account-type-grid">


                        <button
                            type="button"
                            className="account-type-card"
                            onClick={() =>
                                chooseAccountType(
                                    "USER"
                                )
                            }
                        >

                            <div className="account-type-icon">
                                👤
                            </div>

                            <h3>
                                Normal User
                            </h3>

                            <p>
                                Browse stores, view
                                ratings and share
                                your experience.
                            </p>

                            <span>
                                Register as User →
                            </span>

                        </button>


                        <button
                            type="button"
                            className="account-type-card"
                            onClick={() =>
                                chooseAccountType(
                                    "OWNER"
                                )
                            }
                        >

                            <div className="account-type-icon">
                                🏪
                            </div>

                            <h3>
                                Store Owner
                            </h3>

                            <p>
                                Register your store
                                and manage customer
                                ratings.
                            </p>

                            <span>
                                Register as Owner →
                            </span>

                        </button>


                    </div>


                    <div className="register-footer">

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =========================
    // REGISTRATION FORM
    // =========================

    return (

        <div className="register-page">

            <div className="register-card">


                <div className="register-header">

                    <div className="register-logo">
                        ★
                    </div>

                    <div>

                        <h1>
                            RateHub
                        </h1>

                        <span>
                            STORE RATING PLATFORM
                        </span>

                    </div>

                </div>


                <div className="register-title">

                    <button
                        type="button"
                        className="back-register"
                        onClick={
                            goBackToAccountType
                        }
                        disabled={loading}
                    >
                        ← Change account type
                    </button>


                    <span className="register-label">

                        {accountType === "OWNER"
                            ? "OWNER REGISTRATION"
                            : "USER REGISTRATION"}

                    </span>


                    <h2>
                        {accountType === "OWNER"
                            ? "Create Owner Account"
                            : "Create User Account"}
                    </h2>


                    <p>

                        {accountType === "OWNER"
                            ? "Create your owner account and add your store."
                            : "Create your account and start rating stores."}

                    </p>

                </div>


                {serverError && (

                    <div className="register-alert error">

                        <span>
                            !
                        </span>

                        {serverError}

                    </div>

                )}


                {success && (

                    <div className="register-alert success">

                        <span>
                            ✓
                        </span>

                        {success}

                    </div>

                )}


                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >


                    {/* =========================
                        PERSONAL DETAILS
                    ========================== */}

                    {accountType === "OWNER" && (

                        <div className="form-section-title">
                            Owner Details
                        </div>

                    )}


                    {/* NAME */}

                    <div className="register-field">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            maxLength={60}
                            disabled={loading}
                        />

                        <div className="field-bottom">

                            <small>
                                20-60 characters
                            </small>

                            <span>
                                {form.name.length}/60
                            </span>

                        </div>


                        {errors.name && (

                            <p className="field-error">
                                {errors.name}
                            </p>

                        )}

                    </div>


                    {/* EMAIL */}

                    <div className="register-field">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        {errors.email && (

                            <p className="field-error">
                                {errors.email}
                            </p>

                        )}

                    </div>


                    {/* ADDRESS */}

                    <div className="register-field">

                        <label htmlFor="address">
                            Address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            placeholder="Enter your address"
                            value={form.address}
                            onChange={handleChange}
                            maxLength={400}
                            rows={3}
                            disabled={loading}
                        />

                        <div className="field-bottom">

                            <small>
                                Maximum 400 characters
                            </small>

                            <span>
                                {form.address.length}/400
                            </span>

                        </div>


                        {errors.address && (

                            <p className="field-error">
                                {errors.address}
                            </p>

                        )}

                    </div>


                    {/* PASSWORD */}

                    <div className="register-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a strong password"
                            value={form.password}
                            onChange={handleChange}
                            maxLength={16}
                            disabled={loading}
                        />

                        <small className="field-help">
                            8-16 characters • 1 uppercase
                            • 1 special character
                        </small>


                        {errors.password && (

                            <p className="field-error">
                                {errors.password}
                            </p>

                        )}

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="register-field">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Re-enter your password"
                            value={
                                form.confirmPassword
                            }
                            onChange={handleChange}
                            maxLength={16}
                            disabled={loading}
                        />

                        {errors.confirmPassword && (

                            <p className="field-error">
                                {errors.confirmPassword}
                            </p>

                        )}

                    </div>


                    {/* =========================
                        STORE DETAILS
                    ========================== */}

                    {accountType === "OWNER" && (

                        <>

                            <div className="form-section-title store-section-title">
                                Store Details
                            </div>


                            {/* STORE NAME */}

                            <div className="register-field">

                                <label htmlFor="storeName">
                                    Store Name
                                </label>

                                <input
                                    id="storeName"
                                    name="storeName"
                                    type="text"
                                    placeholder="Enter your store name"
                                    value={
                                        form.storeName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                                {errors.storeName && (

                                    <p className="field-error">
                                        {errors.storeName}
                                    </p>

                                )}

                            </div>


                            {/* STORE EMAIL */}

                            <div className="register-field">

                                <label htmlFor="storeEmail">
                                    Store Email
                                </label>

                                <input
                                    id="storeEmail"
                                    name="storeEmail"
                                    type="email"
                                    placeholder="store@example.com"
                                    value={
                                        form.storeEmail
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                                {errors.storeEmail && (

                                    <p className="field-error">
                                        {errors.storeEmail}
                                    </p>

                                )}

                            </div>


                            {/* STORE ADDRESS */}

                            <div className="register-field">

                                <label htmlFor="storeAddress">
                                    Store Address
                                </label>

                                <textarea
                                    id="storeAddress"
                                    name="storeAddress"
                                    placeholder="Enter your store address"
                                    value={
                                        form.storeAddress
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={400}
                                    rows={3}
                                    disabled={loading}
                                />

                                <div className="field-bottom">

                                    <small>
                                        Maximum 400 characters
                                    </small>

                                    <span>
                                        {form.storeAddress.length}/400
                                    </span>

                                </div>


                                {errors.storeAddress && (

                                    <p className="field-error">
                                        {errors.storeAddress}
                                    </p>

                                )}

                            </div>

                        </>

                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="register-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : accountType === "OWNER"
                                ? "Create Owner Account"
                                : "Create Account"}

                    </button>

                </form>


                <div className="register-footer">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>

    );
};

export default Register;
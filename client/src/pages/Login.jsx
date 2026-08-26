import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { loginSuccess } from "../redux/slices/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/auth/login",
                form
            );

            const { token, user } = response.data;

            // Save complete login information
            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "userInfo",
                JSON.stringify(user)
            );

            // Keep Redux authentication state
            dispatch(
                loginSuccess({
                    token,
                    user
                })
            );

            // Role-based navigation
            if (user.role === "ADMIN") {
                navigate("/admin");
            } else if (user.role === "OWNER") {
                navigate("/owner");
            } else {
                navigate("/user");
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #f4f7ff 0%, #eef2ff 50%, #f7f5ff 100%)",
                padding: "30px",
                boxSizing: "border-box",
                fontFamily:
                    "Inter, Arial, Helvetica, sans-serif"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "480px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "42px",
                    boxSizing: "border-box",
                    boxShadow:
                        "0 20px 60px rgba(37, 99, 235, 0.12)",
                    border:
                        "1px solid rgba(226, 232, 240, 0.9)"
                }}
            >

                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "42px"
                    }}
                >
                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            background:
                                "linear-gradient(135deg, #2563eb, #4f46e5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontSize: "22px",
                            fontWeight: "700",
                            boxShadow:
                                "0 8px 20px rgba(37, 99, 235, 0.25)"
                        }}
                    >
                        ★
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: "22px",
                                fontWeight: "800",
                                color: "#172033",
                                lineHeight: "1"
                            }}
                        >
                            RateHub
                        </div>

                        <div
                            style={{
                                marginTop: "5px",
                                fontSize: "9px",
                                fontWeight: "700",
                                letterSpacing: "1.5px",
                                color: "#718096"
                            }}
                        >
                            STORE RATING PLATFORM
                        </div>
                    </div>
                </div>

                {/* Heading */}
                <div style={{ marginBottom: "28px" }}>
                    <div
                        style={{
                            color: "#2563eb",
                            fontSize: "11px",
                            fontWeight: "800",
                            letterSpacing: "1.4px",
                            marginBottom: "8px"
                        }}
                    >
                        WELCOME BACK
                    </div>

                    <h1
                        style={{
                            margin: "0 0 8px 0",
                            fontSize: "32px",
                            lineHeight: "1.2",
                            color: "#172033",
                            fontWeight: "800"
                        }}
                    >
                        Sign in to RateHub
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#718096",
                            fontSize: "14px",
                            lineHeight: "1.6"
                        }}
                    >
                        Login to continue rating stores and
                        managing your account.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            background: "#fff1f2",
                            border: "1px solid #fecdd3",
                            color: "#dc2626",
                            borderRadius: "10px",
                            padding: "12px 14px",
                            fontSize: "13px",
                            marginBottom: "20px"
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "700",
                                color: "#273449",
                                marginBottom: "8px"
                            }}
                        >
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                height: "50px",
                                boxSizing: "border-box",
                                border:
                                    "1px solid #dbe3ef",
                                borderRadius: "10px",
                                padding: "0 15px",
                                fontSize: "14px",
                                outline: "none",
                                color: "#172033",
                                background: "#ffffff"
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "24px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "700",
                                color: "#273449",
                                marginBottom: "8px"
                            }}
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                height: "50px",
                                boxSizing: "border-box",
                                border:
                                    "1px solid #dbe3ef",
                                borderRadius: "10px",
                                padding: "0 15px",
                                fontSize: "14px",
                                outline: "none",
                                color: "#172033",
                                background: "#ffffff"
                            }}
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "52px",
                            border: "none",
                            borderRadius: "10px",
                            background:
                                "linear-gradient(90deg, #2563eb, #4f46e5)",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor:
                                loading
                                    ? "not-allowed"
                                    : "pointer",
                            opacity: loading ? 0.7 : 1,
                            boxShadow:
                                "0 10px 22px rgba(37, 99, 235, 0.22)"
                        }}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>

                {/* Divider */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        margin: "28px 0 22px"
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: "#e5eaf2"
                        }}
                    />

                    <span
                        style={{
                            fontSize: "12px",
                            color: "#94a3b8"
                        }}
                    >
                        New to RateHub?
                    </span>

                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: "#e5eaf2"
                        }}
                    />
                </div>

                {/* Register */}
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "13px",
                        color: "#718096"
                    }}
                >
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                        style={{
                            border: "none",
                            background: "transparent",
                            color: "#2563eb",
                            fontWeight: "700",
                            cursor: "pointer",
                            padding: 0,
                            fontSize: "13px"
                        }}
                    >
                        Register
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Login;
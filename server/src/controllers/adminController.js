const bcrypt = require("bcryptjs");

const {
    getDashboardStats,
    createAdminUser,
    getAllUsers,
    getUserById
} = require("../models/adminModel");


// DASHBOARD
const getDashboard = async (req, res) => {
    try {

        const stats = await getDashboardStats();

        return res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch dashboard statistics"
        });
    }
};


// CREATE USER / ADMIN
const addUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            address,
            role
        } = req.body;

        if (!["USER", "ADMIN"].includes(role)) {

            return res.status(400).json({
                success: false,
                message:
                    "Role must be USER or ADMIN"
            });
        }

        const db = require("../config/db");

        const [existingUsers] =
            await db.execute(
                `
                SELECT id
                FROM users
                WHERE email = ?
                `,
                [email]
            );

        if (existingUsers.length > 0) {

            return res.status(409).json({
                success: false,
                message:
                    "Email already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const userId =
            await createAdminUser(
                name,
                email,
                hashedPassword,
                address,
                role
            );

        return res.status(201).json({
            success: true,
            message:
                "User created successfully",
            userId
        });

    } catch (error) {

        console.error(
            "Admin create user error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create user"
        });
    }
};


// ======================================================
// GET USERS
//
// Query parameters:
//
// ?name=
// ?email=
// ?address=
// ?role=
// ?sortBy=name
// ?sortOrder=asc
//
// Example:
//
// /api/admin/users?name=test&role=USER
//
// /api/admin/users?sortBy=email&sortOrder=desc
// ======================================================

const getUsers = async (req, res) => {
    try {

        const {
            name = "",
            email = "",
            address = "",
            role = "",
            sortBy = "name",
            sortOrder = "asc"
        } = req.query;

        const users =
            await getAllUsers({
                name,
                email,
                address,
                role,
                sortBy,
                sortOrder
            });

        return res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {

        console.error(
            "Get users error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch users"
        });
    }
};


// USER DETAILS
const getUserDetails = async (req, res) => {
    try {

        const { userId } = req.params;

        const user =
            await getUserById(userId);

        if (!user) {

            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        console.error(
            "Get user details error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch user details"
        });
    }
};


module.exports = {
    getDashboard,
    addUser,
    getUsers,
    getUserDetails
};
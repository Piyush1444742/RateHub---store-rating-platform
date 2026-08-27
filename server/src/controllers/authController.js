const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    findUserByEmail,
    createUser
} = require("../models/userModel");

const {
    createStore
} = require("../models/storeModel");

const db = require("../config/db");


const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            address,
            accountType,
            store
        } = req.body;


        // Only USER and OWNER are allowed
        // through public registration.

        if (
            !["USER", "OWNER"].includes(
                accountType
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please select a valid account type"
            });

        }


        // Check user email

        const existingUser =
            await findUserByEmail(email);


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message:
                    "Email already registered"
            });

        }


        // Owner must provide store details

        if (accountType === "OWNER") {

            if (
                !store ||
                !store.name ||
                !store.email ||
                !store.address
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Store name, email and address are required for owner registration"
                });

            }

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // Create user

        const role =
            accountType === "OWNER"
                ? "OWNER"
                : "USER";


        const userId =
            await createUser(
                name,
                email,
                hashedPassword,
                address,
                role
            );


        // Create store for owner

        if (accountType === "OWNER") {

            try {

                await createStore(
                    store.name.trim(),
                    store.email.trim(),
                    store.address.trim(),
                    userId
                );

            } catch (storeError) {

                console.error(
                    "Owner store creation error:",
                    storeError
                );


                // Remove owner if store creation fails.
                // This prevents an incomplete owner
                // registration.

                await db.execute(
                    `
                    DELETE FROM users
                    WHERE id = ?
                    AND role = 'OWNER'
                    `,
                    [userId]
                );


                if (
                    storeError.code ===
                    "ER_DUP_ENTRY"
                ) {

                    return res.status(409).json({
                        success: false,
                        message:
                            "Store email already exists"
                    });

                }


                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to create store. Registration was cancelled."
                });

            }

        }


        return res.status(201).json({

            success: true,

            message:
                accountType === "OWNER"
                    ? "Owner registration successful"
                    : "Registration successful",

            userId

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({
                success: false,
                message:
                    "Email already registered"
            });

        }


        return res.status(500).json({
            success: false,
            message:
                "Internal server error"
        });

    }

};


const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user =
            await findUserByEmail(
                email
            );


        if (!user) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });

        }


        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordValid) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });

        }


        const token =
            jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );


        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Internal server error"
        });

    }

};


module.exports = {
    register,
    login
};
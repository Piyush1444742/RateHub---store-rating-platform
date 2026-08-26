const bcrypt = require("bcryptjs");

const {
    getStoresForUser
} = require("../models/userStoreModel");

const db = require("../config/db");

// GET STORES FOR USER
const getUserStores = async (req, res) => {
    try {
        const search = req.query.search || "";

        const stores = await getStoresForUser(
            req.user.id,
            search
        );

        return res.status(200).json({
            success: true,
            data: stores
        });

    } catch (error) {
        console.error("Get user stores error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch stores"
        });
    }
};

// UPDATE USER PASSWORD
const updateUserPassword = async (req, res) => {
    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        const userId = req.user.id;

        // Basic validation

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }


        // ----------------------------------------------
        // Password validation
        //
        // 8-16 characters
        // At least one uppercase letter
        // At least one special character
        // ----------------------------------------------

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
            });
        }

        // Get current password

        const [users] = await db.execute(
            `
            SELECT password
            FROM users
            WHERE id = ? AND role = 'USER'
            `,
            [userId]
        );


        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const isCurrentPasswordValid =
            await bcrypt.compare(
                currentPassword,
                users[0].password
            );


        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Prevent same password
        const isSamePassword =
            await bcrypt.compare(
                newPassword,
                users[0].password
            );


        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from current password"
            });
        }

        // Hash new password

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        // Update database
        await db.execute(
            `
            UPDATE users
            SET password = ?
            WHERE id = ? AND role = 'USER'
            `,
            [hashedPassword, userId]
        );


        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {

        console.error(
            "Update user password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update password"
        });
    }
};


module.exports = {
    getUserStores,
    updateUserPassword
};
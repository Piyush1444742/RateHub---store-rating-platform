const bcrypt = require("bcryptjs");
const {
    getOwnerDashboard,
    getStoreRatingUsers,
    updateOwnerPassword
} = require("../models/ownerModel");

const getDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const stores = await getOwnerDashboard(ownerId);
        const ratingUsers = await getStoreRatingUsers(ownerId);

        return res.status(200).json({
            success: true,
            data: {
                stores,
                ratingUsers
            }
        });
    } catch (error) {
        console.error("Owner dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch owner dashboard"
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const ownerId = req.user.id;

        const db = require("../config/db");

        const [users] = await db.execute(
            `SELECT password
             FROM users
             WHERE id = ? AND role = 'OWNER'`,
            [ownerId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword,
            users[0].password
        );

        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await updateOwnerPassword(
            ownerId,
            hashedPassword
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Update owner password error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update password"
        });
    }
};

module.exports = {
    getDashboard,
    updatePassword
};
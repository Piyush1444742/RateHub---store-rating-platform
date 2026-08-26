const db = require("../config/db");
const {
    createRating,
    findUserRating,
    updateRating
} = require("../models/ratingModel");

const submitRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body;
        const userId = req.user.id;
        const [stores] = await db.execute(
    `SELECT id FROM stores WHERE id = ?`,
    [storeId]
);

if (stores.length === 0) {
    return res.status(404).json({
        success: false,
        message: "Store not found"
    });
}

        const existingRating = await findUserRating(
            userId,
            storeId
        );

        if (existingRating) {
            return res.status(409).json({
                success: false,
                message: "You have already rated this store"
            });
        }

        const ratingId = await createRating(
            userId,
            storeId,
            rating
        );

        return res.status(201).json({
            success: true,
            message: "Rating submitted successfully",
            ratingId
        });
    } catch (error) {
        console.error("Submit rating error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit rating"
        });
    }
};

const modifyRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { rating } = req.body;
        const userId = req.user.id;

        const affectedRows = await updateRating(
            ratingId,
            userId,
            rating
        );

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Rating not found or access denied"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Rating updated successfully"
        });
    } catch (error) {
        console.error("Modify rating error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update rating"
        });
    }
};

module.exports = {
    submitRating,
    modifyRating
};
const db = require("../config/db");

const createRating = async (userId, storeId, rating) => {
    const [result] = await db.execute(
        `INSERT INTO ratings (user_id, store_id, rating)
         VALUES (?, ?, ?)`,
        [userId, storeId, rating]
    );

    return result.insertId;
};

const findUserRating = async (userId, storeId) => {
    const [rows] = await db.execute(
        `SELECT id, user_id, store_id, rating
         FROM ratings
         WHERE user_id = ? AND store_id = ?`,
        [userId, storeId]
    );

    return rows[0];
};

const updateRating = async (ratingId, userId, rating) => {
    const [result] = await db.execute(
        `UPDATE ratings
         SET rating = ?
         WHERE id = ? AND user_id = ?`,
        [rating, ratingId, userId]
    );

    return result.affectedRows;
};

module.exports = {
    createRating,
    findUserRating,
    updateRating
};
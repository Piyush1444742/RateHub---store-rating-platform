const db = require("../config/db");

const getStoresForUser = async (userId, search = "") => {
    const searchTerm = `%${search}%`;

    const [rows] = await db.execute(
        `
        SELECT
            s.id,
            s.name,
            s.address,
            COALESCE(AVG(all_ratings.rating), 0) AS overall_rating,
            user_rating.id AS rating_id,
            user_rating.rating AS user_rating
        FROM stores s

        LEFT JOIN ratings all_ratings
            ON s.id = all_ratings.store_id

        LEFT JOIN ratings user_rating
            ON s.id = user_rating.store_id
            AND user_rating.user_id = ?

        WHERE s.name LIKE ?
           OR s.address LIKE ?

        GROUP BY
            s.id,
            s.name,
            s.address,
            user_rating.id,
            user_rating.rating

        ORDER BY s.name ASC
        `,
        [userId, searchTerm, searchTerm]
    );

    return rows;
};

module.exports = {
    getStoresForUser
};
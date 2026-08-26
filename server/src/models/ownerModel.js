const db = require("../config/db");

const getOwnerDashboard = async (ownerId) => {
    const [stores] = await db.execute(
        `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            COALESCE(AVG(r.rating), 0) AS average_rating
        FROM stores s
        LEFT JOIN ratings r
            ON s.id = r.store_id
        WHERE s.owner_id = ?
        GROUP BY
            s.id,
            s.name,
            s.email,
            s.address
        `,
        [ownerId]
    );

    return stores;
};

const getStoreRatingUsers = async (ownerId) => {
    const [rows] = await db.execute(
        `
        SELECT
            s.id AS store_id,
            s.name AS store_name,
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email,
            r.rating
        FROM stores s
        INNER JOIN ratings r
            ON s.id = r.store_id
        INNER JOIN users u
            ON r.user_id = u.id
        WHERE s.owner_id = ?
        ORDER BY s.name ASC, u.name ASC
        `,
        [ownerId]
    );

    return rows;
};

const updateOwnerPassword = async (ownerId, newPassword) => {
    const [result] = await db.execute(
        `UPDATE users
         SET password = ?
         WHERE id = ? AND role = 'OWNER'`,
        [newPassword, ownerId]
    );

    return result.affectedRows;
};

module.exports = {
    getOwnerDashboard,
    getStoreRatingUsers,
    updateOwnerPassword
};
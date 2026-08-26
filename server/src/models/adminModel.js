const db = require("../config/db");

// ADMIN DASHBOARD
const getDashboardStats = async () => {
    const [[userCount]] = await db.execute(
        "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [[storeCount]] = await db.execute(
        "SELECT COUNT(*) AS totalStores FROM stores"
    );

    const [[ratingCount]] = await db.execute(
        "SELECT COUNT(*) AS totalRatings FROM ratings"
    );

    return {
        totalUsers: Number(userCount.totalUsers),
        totalStores: Number(storeCount.totalStores),
        totalRatings: Number(ratingCount.totalRatings)
    };
};

// CREATE USER / ADMIN
const createAdminUser = async (
    name,
    email,
    password,
    address,
    role
) => {
    const [result] = await db.execute(
        `
        INSERT INTO users
        (name, email, password, address, role)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            name,
            email,
            password,
            address,
            role
        ]
    );

    return result.insertId;
};


// ======================================================
// GET ALL USERS
// Supports:
// name
// email
// address
// role
// sorting
// ======================================================

const getAllUsers = async ({
    name = "",
    email = "",
    address = "",
    role = "",
    sortBy = "name",
    sortOrder = "asc"
} = {}) => {

    const allowedSortColumns = {
        name: "u.name",
        email: "u.email",
        address: "u.address",
        role: "u.role",
        id: "u.id"
    };

    const sortColumn =
        allowedSortColumns[sortBy] || allowedSortColumns.name;

    const order =
        String(sortOrder).toLowerCase() === "desc"
            ? "DESC"
            : "ASC";

    let query = `
        SELECT
            u.id,
            u.name,
            u.email,
            u.address,
            u.role
        FROM users u
        WHERE 1 = 1
    `;

    const params = [];

    // Name filter
    if (name) {
        query += ` AND u.name LIKE ?`;
        params.push(`%${name}%`);
    }

    // Email filter
    if (email) {
        query += ` AND u.email LIKE ?`;
        params.push(`%${email}%`);
    }

    // Address filter
    if (address) {
        query += ` AND u.address LIKE ?`;
        params.push(`%${address}%`);
    }

    // Role filter
    if (role) {
        query += ` AND u.role = ?`;
        params.push(role);
    }

    query += `
        ORDER BY ${sortColumn} ${order}
    `;

    const [rows] = await db.execute(
        query,
        params
    );

    return rows;
};


// ======================================================
// GET USER DETAILS
//
// For normal/admin:
// name, email, address, role
//
// For owner:
// also return owned stores + average ratings
// ======================================================

const getUserById = async (userId) => {
    const [rows] = await db.execute(
        `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
        WHERE id = ?
        `,
        [userId]
    );

    if (rows.length === 0) {
        return null;
    }

    const user = rows[0];

    // If user is an owner, fetch store information
    if (user.role === "OWNER") {

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
            ORDER BY s.name ASC
            `,
            [userId]
        );

        user.stores = stores.map((store) => ({
            ...store,
            average_rating: Number(
                store.average_rating
            ).toFixed(1)
        }));
    }

    return user;
};


module.exports = {
    getDashboardStats,
    createAdminUser,
    getAllUsers,
    getUserById
};
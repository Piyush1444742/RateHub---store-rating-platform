const db = require("../config/db");

// CREATE STORE
const createStore = async (
    name,
    email,
    address,
    ownerId
) => {

    const [result] = await db.execute(
        `
        INSERT INTO stores
        (name, email, address, owner_id)
        VALUES (?, ?, ?, ?)
        `,
        [
            name,
            email,
            address,
            ownerId
        ]
    );

    return result.insertId;
};


// ======================================================
// GET ALL STORES
//
// Supports:
//
// name
// email
// address
// sorting
// ======================================================

const getAllStores = async ({
    name = "",
    email = "",
    address = "",
    sortBy = "name",
    sortOrder = "asc"
} = {}) => {

    const allowedSortColumns = {
        name: "s.name",
        email: "s.email",
        address: "s.address",
        rating: "overall_rating",
        id: "s.id"
    };

    const sortColumn =
        allowedSortColumns[sortBy]
        || allowedSortColumns.name;

    const order =
        String(sortOrder).toLowerCase() === "desc"
            ? "DESC"
            : "ASC";


    let query = `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            s.owner_id,
            COALESCE(
                AVG(r.rating),
                0
            ) AS overall_rating

        FROM stores s

        LEFT JOIN ratings r
            ON s.id = r.store_id

        WHERE 1 = 1
    `;

    const params = [];


    // Name filter
    if (name) {

        query += `
            AND s.name LIKE ?
        `;

        params.push(
            `%${name}%`
        );
    }


    // Email filter
    if (email) {

        query += `
            AND s.email LIKE ?
        `;

        params.push(
            `%${email}%`
        );
    }


    // Address filter
    if (address) {

        query += `
            AND s.address LIKE ?
        `;

        params.push(
            `%${address}%`
        );
    }


    query += `
        GROUP BY
            s.id,
            s.name,
            s.email,
            s.address,
            s.owner_id

        ORDER BY
            ${sortColumn} ${order}
    `;


    const [rows] =
        await db.execute(
            query,
            params
        );


    return rows.map((store) => ({
        ...store,
        overall_rating:
            Number(
                store.overall_rating
            ).toFixed(1)
    }));
};

// UPDATE STORE
const updateStore = async (
    storeId,
    ownerId,
    name,
    email,
    address
) => {

    const [result] = await db.execute(
        `
        UPDATE stores

        SET
            name = ?,
            email = ?,
            address = ?

        WHERE id = ?
        AND owner_id = ?
        `,
        [
            name,
            email,
            address,
            storeId,
            ownerId
        ]
    );

    return result;
};


module.exports = {
    createStore,
    getAllStores,
    updateStore
};
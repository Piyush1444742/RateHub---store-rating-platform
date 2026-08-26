const {
    createStore,
    getAllStores,
    updateStore
} = require("../models/storeModel");

const db = require("../config/db");

// CREATE STORE
const addStore = async (req, res) => {
    try {

        const {
            name,
            email,
            address,
            ownerId
        } = req.body;


        // Check owner
        const [owners] =
            await db.execute(
                `
                SELECT id
                FROM users
                WHERE id = ?
                AND role = 'OWNER'
                `,
                [ownerId]
            );


        if (owners.length === 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid owner. User must have OWNER role"
            });
        }


        const storeId =
            await createStore(
                name,
                email,
                address,
                ownerId
            );


        return res.status(201).json({
            success: true,
            message:
                "Store created successfully",
            storeId
        });


    } catch (error) {

        console.error(
            "Create store error:",
            error
        );


        if (
            error.code ===
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
                "Failed to create store"
        });
    }
};


// ======================================================
// GET STORES
//
// Query parameters:
//
// ?name=
// ?email=
// ?address=
// ?sortBy=name
// ?sortOrder=asc
//
// Example:
//
// /api/admin/stores?name=tech
//
// /api/admin/stores?sortBy=rating&sortOrder=desc
// ======================================================

const getStores = async (req, res) => {
    try {

        const {
            name = "",
            email = "",
            address = "",
            search = "",
            sortBy = "name",
            sortOrder = "asc"
        } = req.query;


        // Backward compatibility:
        // existing frontend can still use ?search=
        const finalName =
            name || search;


        const stores =
            await getAllStores({
                name: finalName,
                email,
                address,
                sortBy,
                sortOrder
            });


        return res.status(200).json({
            success: true,
            data: stores
        });


    } catch (error) {

        console.error(
            "Get stores error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch stores"
        });
    }
};

// UPDATE STORE
const editStore = async (req, res) => {
    try {

        const { storeId } =
            req.params;

        const {
            name,
            email,
            address
        } = req.body;


        // Logged-in owner's ID
        const ownerId =
            req.user.id;


        const result =
            await updateStore(
                storeId,
                ownerId,
                name,
                email,
                address
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "Store not found or you are not the owner"
            });
        }


        return res.status(200).json({
            success: true,
            message:
                "Store updated successfully"
        });


    } catch (error) {

        console.error(
            "Update store error:",
            error
        );


        if (
            error.code ===
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
                "Failed to update store"
        });
    }
};


module.exports = {
    addStore,
    getStores,
    editStore
};
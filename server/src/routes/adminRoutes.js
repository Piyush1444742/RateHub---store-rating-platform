const express = require("express");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const {
    getDashboard,
    addUser,
    getUsers,
    getUserDetails
} = require("../controllers/adminController");

const {
    storeValidator
} = require("../validators/storeValidator");

const { validationResult } = require("express-validator");


const {
    adminUserValidator
} = require("../validators/adminUserValidator");

//const { addStore } = require("../controllers/storeController");

const {
    addStore,
    getStores
} = require("../controllers/storeController");

const router = express.Router();

router.get(
    "/dashboard",
    authenticate,
    authorize("ADMIN"),
    getDashboard
);


router.post(
    "/stores",
    authenticate,
    authorize("ADMIN"),
    storeValidator,
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        return addStore(req, res);
    }
);

router.get(
    "/stores",
    authenticate,
    authorize("ADMIN"),
    getStores
);

router.post(
    "/users",
    authenticate,
    authorize("ADMIN"),
    adminUserValidator,
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        return addUser(req, res);
    }
);

router.get(
    "/users",
    authenticate,
    authorize("ADMIN"),
    getUsers
);

router.get(
    "/users/:userId",
    authenticate,
    authorize("ADMIN"),
    getUserDetails
);

module.exports = router;
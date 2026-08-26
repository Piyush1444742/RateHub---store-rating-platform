const express = require("express");
const { validationResult } = require("express-validator");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const {
    getDashboard,
    updatePassword
} = require("../controllers/ownerController");

const {
    editStore
} = require("../controllers/storeController");

const {
    ownerPasswordValidator
} = require("../validators/passwordValidator");

const {
    updateStoreValidator
} = require("../validators/updateStoreValidator");

const router = express.Router();

// OWNER DASHBOARD
router.get(
    "/dashboard",
    authenticate,
    authorize("OWNER"),
    getDashboard
);

// UPDATE STORE
router.put(
    "/stores/:storeId",
    authenticate,
    authorize("OWNER"),
    updateStoreValidator,
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        return editStore(req, res);
    }
);

// CHANGE PASSWORD
router.put(
    "/password",
    authenticate,
    authorize("OWNER"),
    ownerPasswordValidator,
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        return updatePassword(req, res);
    }
);

module.exports = router;
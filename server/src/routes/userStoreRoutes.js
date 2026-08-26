const express = require("express");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const {
    getUserStores,
    updateUserPassword
} = require("../controllers/userStoreController");

const router = express.Router();

// GET STORES
router.get(
    "/stores",
    authenticate,
    authorize("USER"),
    getUserStores
);

// UPDATE USER PASSWORD
router.put(
    "/password",
    authenticate,
    authorize("USER"),
    updateUserPassword
);


module.exports = router;
const express = require("express");
const { validationResult } = require("express-validator");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const {
    submitRating,
    modifyRating
} = require("../controllers/ratingController");

const {
    ratingValidator,
    updateRatingValidator
} = require("../validators/ratingValidator");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("USER"),
    ratingValidator,
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        return submitRating(req, res);
    }
);

router.put(
    "/:ratingId",
    authenticate,
    authorize("USER"),
    updateRatingValidator,
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        return modifyRating(req, res);
    }
);

module.exports = router;
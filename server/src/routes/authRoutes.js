const express = require("express");
const { validationResult } = require("express-validator");

const { registerValidator } = require("../validators/authValidator");
const { loginValidator } = require("../validators/loginValidator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerValidator, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    return register(req, res);
});

router.post("/login", loginValidator, (req, res) => {
    return login(req, res);
});

module.exports = router;
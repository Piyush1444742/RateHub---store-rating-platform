const { body } = require("express-validator");

const ownerPasswordValidator = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .isLength({ min: 8, max: 16 })
        .withMessage("New password must be between 8 and 16 characters")
        .matches(/[A-Z]/)
        .withMessage("New password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>_\-\\[\];'/+=`~]/)
        .withMessage("New password must contain at least one special character")
];

module.exports = {
    ownerPasswordValidator
};
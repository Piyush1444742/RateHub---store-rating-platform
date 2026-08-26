const { body } = require("express-validator");

const storeValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Store name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid store email is required"),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Store address is required"),

    body("ownerId")
        .isInt({ min: 1 })
        .withMessage("Valid owner ID is required")
];

module.exports = {
    storeValidator
};
const { body } = require("express-validator");

const updateStoreValidator = [
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
        .withMessage("Store address is required")
];

module.exports = {
    updateStoreValidator
};
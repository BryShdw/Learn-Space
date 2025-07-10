const { body } = require('express-validator');

exports.validateRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    body('lastName')
        .trim()
        .notEmpty().withMessage('El apellido es obligatorio.')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.'),
    body('email')
        .trim()
        .isEmail().withMessage('Debe ser un correo electrónico válido.')
        .normalizeEmail(),
    body('fecNac')
        .notEmpty().withMessage('La fecha de nacimiento es obligatoria.')
        .isISO8601().withMessage('La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD).')
        .toDate(),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden.');
            }
            return true;
        })
];

exports.validateLogin = [
    body('email')
        .trim()
        .isEmail().withMessage('Debe ser un correo electrónico válido.')
        .normalizeEmail(),
    body('pass') // Changed from 'password' to 'pass' to match form field name
        .notEmpty().withMessage('La contraseña es obligatoria.')
];

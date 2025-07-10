const bcryptjs = require('bcryptjs');
const connection = require('../config/database');
const { validationResult } = require('express-validator'); // We'll add express-validator soon

// Helper to calculate age (can be moved to a utility file later)
const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

exports.getLoginPage = (req, res) => {
    res.render('login', { error: null, values: {} }); // Pass empty error and values initially
};

exports.getRegisterPage = (req, res) => {
    res.render('registro', { errors: [], values: {} }); // Pass empty errors and values initially
};

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('registro', { errors: errors.array(), values: req.body });
    }

    const { name, lastName, email, fecNac, password } = req.body;
    try {
        const existingUser = await new Promise((resolve, reject) => {
            connection.query('SELECT email FROM users WHERE email = ?', [email], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        if (existingUser.length > 0) {
            return res.render('registro', {
                errors: [{ msg: 'El correo electrónico ya está registrado.' }],
                values: req.body
            });
        }

        let passwordHash = await bcryptjs.hash(password, 8);
        connection.query('INSERT INTO users SET ?', {
            first_name: name,
            last_name: lastName,
            email: email,
            birth_date: fecNac,
            password: passwordHash
        }, (error, results) => {
            if (error) {
                console.log(error);
                // It's better to show a generic error to the user and log the specific one
                return res.render('registro', {
                    errors: [{ msg: 'Error al registrar el usuario. Inténtalo de nuevo.' }],
                    values: req.body
                });
            }
            // Redirect to login page with a success message (optional)
            res.redirect('/login?registration=success');
        });
    } catch (error) {
        console.log(error);
        res.render('registro', {
            errors: [{ msg: 'Error en el servidor durante el registro. Inténtalo de nuevo.' }],
            values: req.body
        });
    }
};

exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', { error: errors.array()[0].msg, values: req.body });
    }

    const { email, pass } = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('login', { error: 'Error en el servidor.', values: req.body });
        }
        if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].password))) {
            return res.render('login', { error: 'Usuario y/o contraseña incorrectos', values: req.body });
        }
        const user = results[0];
        const age = calculateAge(user.birth_date);

        req.session.user = {
            id: user.id_user, // Ensure your DB schema has id_user or adjust accordingly
            name: user.first_name,
            email: user.email,
            age: age,
            // role: user.role_id // Assuming you'll add roles
        };

        const returnTo = req.session.returnTo || '/home';
        delete req.session.returnTo; // Clear the returnTo path from session
        res.redirect(returnTo);
    });
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            // Even if session destroy fails, redirecting to login is usually safe
            return res.redirect('/login');
        }
        res.redirect('/login');
    });
};

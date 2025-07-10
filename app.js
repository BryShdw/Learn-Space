// 1- Invocamos a express 
const express = require('express');
const app = express();
const path = require('path');

//2- Seteamos urlencoded para capturar datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//3- Invocamos dot env
const dotenv = require('dotenv');
const e = require('express');
const exp = require('constants');
dotenv.config({path:'./env/.env'});

//4- Directorio Public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5- Motor de Plantillas
app.set('view engine', 'ejs');

//6- Invocamos bcryptjs
const bcryptjs = require('bcryptjs');

//7. Var de Sesión
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: true
}));

//8- Invocamos al modulo de conexión
// const connection = require('./config/database'); // No longer needed here directly, managed by routes

//9- Importamos Rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');


// Global middleware to pass user and ageGroup to all templates if user is logged in
// This should come after session initialization and before routes that need it.
app.use((req, res, next) => {
    if (req.session.user) {
        const age = req.session.user.age; // Assuming age is stored in session
        let ageGroup = 'adult'; // Default
        if (age >= 6 && age <= 9) {
            ageGroup = 'kids';
        } else if (age >= 10 && age <= 17) {
            ageGroup = 'teens';
        }
        res.locals.ageGroup = ageGroup;
        res.locals.user = req.session.user;
    }
    next();
});

// Usamos las rutas importadas
app.use('/', indexRoutes); // Handles general routes like /, /home, /curso, etc.
app.use('/', authRoutes); // Handles /login, /register, /auth, /logout


app.listen(3000, (req, res) =>{
    console.log('SERVER RUNNING IN http://localhost:3000')
})
// 1- Invocamos a express 
const express = require('express');
const app = express();
const path = require('path');

//2- Seteamos urlencoded para capturar datos del formulario
app.use(express.urlencoded({ extended: false }));
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
    resave: true,
    saveUninitialized: true
}));

//8- Invocamos al modulo de conexión
const connection = require('./database/db');

//9- Importamos Rutas
app.get('/', (req, res)=>{
    res.render('index');
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.get('/register', (req, res)=>{
    res.render('registro');
})

app.get('/home', (req, res)=>{
    res.render('home');
})



// 10 - Registro

app.post('/register', async (req, res) => { // Asegúrate de usar una ruta diferente para registro
    console.log(req.body);
    const name = req.body.name; // first_name
    const lastName = req.body.lastName; // last_name
    const email = req.body.email; // email
    const fecNac = req.body.fecNac; // birth_date
    const password = req.body.password;

    let passwordHash = await bcryptjs.hash(password, 8); // Corregido nombre de variable (de passwordHaash a passwordHash)

    // Asegúrate de que los nombres de las propiedades coincidan con los de la tabla
    connection.query('INSERT INTO users SET ?', {
        first_name: name, // correspondencia con first_name
        last_name: lastName, // correspondencia con last_name
        email: email, // correspondencia con email
        birth_date: fecNac, // correspondencia con birth_date
        password: passwordHash // correspondencia con password
    }, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al registrar el usuario'); // Mejor manejo de errores
        } else {
            res.render('login');
        }
    });
});




// 11 - Inicio de sesión

app.post('/auth', async (req, res) => {
    try {
        console.log(req.body); // Para verificar qué se envía en el formulario

        const email = req.body.email;
        const pass = req.body.pass;

        if (email && pass) {
            connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
                if (error) {
                    console.error('Error en la consulta:', error);
                    return res.status(500).send('Error en el servidor');
                }

                if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].password))) {
                    res.status(401).send('USUARIO Y/O PASSWORD INCORRECTOS');
                } else {
                    res.render('home');
                }
            });
        } else {
            res.status(400).send('Por favor, ingrese correo y contraseña');
        }
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).send('Error en el servidor');
    }
});



app.listen(3000, (req, res) =>{
    console.log('SERVER RUNNING IN http://localhost:3000')
})
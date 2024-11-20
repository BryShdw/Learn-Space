// 1- Invocamos a express 
const express = require('express');
const app = express();
const path = require('path');

//2- Seteamos urlencoded para capturar atos del formulario
app.use(express.urlencoded({extended:false}));
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

app.listen(3000, (req, res) =>{
    console.log('SERVER RUNNING IN http://localhost:3000')
})
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

// Middleware para asignar el grupo de edad a todas las plantillas

const calculateAgeGroup = (age) => {
    if (age >= 6 && age <= 9) {
        return 'kids';
    } else if (age >= 10 && age <= 17) {
        return 'teens';
    }
    return 'adult'; // Por defecto, adulto
};

app.use((req, res, next) => {
    if (req.session.user) {
        const age = req.session.user.age;
        let ageGroup = 'adult'; // Valor predeterminado

        if (age >= 6 && age <= 9) {
            ageGroup = 'kids';
        } else if (age >= 10 && age <= 17) {
            ageGroup = 'teens';
        }

        res.locals.ageGroup = ageGroup; // Variable accesible en todas las plantillas
        res.locals.user = req.session.user; // También pasa el usuario para todas las plantillas
    }
    next();
});

const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    // Ajustar si aún no ha cumplido años este año
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

app.post('/auth', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;

    connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].password))) {
            res.send('USUARIO Y/O PASSWORD INCORRECTOS');
        } else {
            const user = results[0];
            const age = calculateAge(user.birth_date);

            req.session.user = {
                id: user.id_user,
                name: user.first_name,
                age // Calculada a partir de `birth_date`
            };

            res.redirect('/home');
        }
    });
});


//ruta home
app.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    const querySchools = 'SELECT * FROM schools';
    // Consulta para obtener los cursos
    const queryCourses = 'SELECT * FROM courses';

    // Ejecutamos ambas consultas
    connection.query(querySchools, (errorSchools, schools) => {
        if (errorSchools) {
            console.error(errorSchools);
            return res.status(500).send('Error al obtener las escuelas');
        }

        connection.query(queryCourses, (errorCourses, courses) => {
            if (errorCourses) {
                console.error(errorCourses);
                return res.status(500).send('Error al obtener los cursos');
            }

            // Renderizamos la vista con ambas listas
            res.render('home', { schools, courses });
        });
    });
});

// Ruta dinámica para un curso específico
app.get('/curso/:id_course', (req, res) => {
    const courseId = req.params.id_course;

    // Consulta para obtener la información básica del curso
    const courseQuery = 'SELECT * FROM courses WHERE id_course = ?';

    // Consulta para obtener los módulos relacionados
    const modulesQuery = 'SELECT * FROM course_modules WHERE course_id = ?';

    connection.query(courseQuery, [courseId], (error, courseResults) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error al obtener el curso');
        }

        if (courseResults.length === 0) {
            return res.status(404).send('Curso no encontrado');
        }

        // Obtener los módulos del curso
        connection.query(modulesQuery, [courseId], (error, moduleResults) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error al obtener los módulos');
            }

            // Añadir los módulos al curso y renderizar
            const course = courseResults[0];
            course.modules = moduleResults; // Agregar módulos al curso
            res.render('curso', { course });
        });
    });
});


// Ruta dinámica para módulos específicos

app.get('/modulo/:courseId/:moduleIndex', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // O maneja el error adecuadamente
    }

    const { courseId, moduleIndex } = req.params;

    const moduleQuery = `
        SELECT * 
        FROM course_modules 
        WHERE course_id = ? 
        ORDER BY module_order ASC 
        LIMIT 1 OFFSET ?;
    `;

    connection.query(moduleQuery, [courseId, parseInt(moduleIndex)], (error, moduleResults) => {
        if (error) {
            console.error('Error al cargar el módulo:', error);
            return res.status(500).send('Error interno del servidor');
        }

        if (moduleResults.length === 0) {
            return res.status(404).send('Módulo no encontrado');
        }

        const module = moduleResults[0];
        res.render('modulo', {
            user: req.session.user, // Usuario actual
            ageGroup: res.locals.ageGroup,
            module: {
                title: module.title,
                description: module.description,
                url: module.video_url,
                index: parseInt(moduleIndex),
            },
        });
    });
});



app.get('/becas', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // Pasar el ageGroup correctamente a la vista
    res.render('becas', {
        user: req.session.user, 
        ageGroup: req.session.user.ageGroup || 'adult' // Si no está definido, usar 'adult' por defecto
    });
});

app.get('/carrito', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('carrito', {
        user: req.session.user,
        ageGroup: req.session.user.ageGroup || 'adult' // Asegurarse de pasar ageGroup
    });
});

app.get('/planes', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('planes', {
        user: req.session.user,
        ageGroup: req.session.user.ageGroup || 'adult' // Pasar correctamente el ageGroup
    });
});

app.get('/editar-perfil', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirigir si no hay usuario autenticado
    }

    // Pasar datos específicos para la edición del perfil
    res.render('editar-perfil', {
        user: req.session.user, 
        ageGroup: req.session.user.ageGroup || 'adult' // Pasar ageGroup aquí también
    });
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login'); // Redirigir a la página de login después de cerrar sesión
    });
});

app.listen(3000, (req, res) =>{
    console.log('SERVER RUNNING IN http://localhost:3000')
})
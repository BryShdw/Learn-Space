const connection = require('../config/database');

exports.getIndexPage = (req, res) => {
    if (req.session.user) {
        return res.redirect('/home');
    }
    res.render('index');
};

exports.getHomePage = (req, res) => {
    // User and ageGroup are available in res.locals due to middleware in app.js
    const querySchools = 'SELECT * FROM schools';
    const queryCourses = 'SELECT * FROM courses';

    connection.query(querySchools, (errorSchools, schools) => {
        if (errorSchools) {
            console.error(errorSchools);
            // Consider rendering an error page or home with an error message
            return res.status(500).send('Error al obtener las escuelas');
        }
        connection.query(queryCourses, (errorCourses, courses) => {
            if (errorCourses) {
                console.error(errorCourses);
                // Consider rendering an error page or home with an error message
                return res.status(500).send('Error al obtener los cursos');
            }
            res.render('home', { schools, courses });
        });
    });
};

exports.getBecasPage = (req, res) => {
    // User and ageGroup are available in res.locals
    res.render('becas');
};

exports.getCarritoPage = (req, res) => {
    // User and ageGroup are available in res.locals
    res.render('carrito');
};

exports.getPlanesPage = (req, res) => {
    // User and ageGroup are available in res.locals
    res.render('planes');
};

exports.getEditProfilePage = (req, res) => {
    // User and ageGroup are available in res.locals
    res.render('editar-perfil');
};

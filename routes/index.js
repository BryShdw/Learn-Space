const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const courseController = require('../controllers/courseController');
const { isAuthenticated } = require('../middlewares/authMiddleware'); // We'll create this next

// Publicly accessible routes
router.get('/', pageController.getIndexPage);

// Routes requiring authentication
router.get('/home', isAuthenticated, pageController.getHomePage);
router.get('/curso/:id_course', isAuthenticated, courseController.getCoursePage);
router.get('/modulo/:courseId/:moduleIndex', isAuthenticated, courseController.getModulePage);
router.get('/becas', isAuthenticated, pageController.getBecasPage);
router.get('/carrito', isAuthenticated, pageController.getCarritoPage);
router.get('/planes', isAuthenticated, pageController.getPlanesPage);
router.get('/editar-perfil', isAuthenticated, pageController.getEditProfilePage);

module.exports = router;

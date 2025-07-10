const connection = require('../config/database');

exports.getCoursePage = (req, res) => {
    // User and ageGroup are available in res.locals
    const courseId = req.params.id_course;
    if (isNaN(parseInt(courseId))) {
        return res.status(400).send('ID de curso inválido.');
    }

    const courseQuery = 'SELECT * FROM courses WHERE id_course = ?';
    // Ensure modules are ordered, e.g., by an 'module_order' column
    const modulesQuery = 'SELECT * FROM course_modules WHERE course_id = ? ORDER BY module_order ASC';

    connection.query(courseQuery, [courseId], (error, courseResults) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error al obtener el curso');
        }
        if (courseResults.length === 0) {
            // It might be better to render a 404 page
            return res.status(404).send('Curso no encontrado');
        }
        connection.query(modulesQuery, [courseId], (error, moduleResults) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error al obtener los módulos');
            }
            const course = courseResults[0];
            course.modules = moduleResults;
            res.render('curso', { course });
        });
    });
};

exports.getModulePage = (req, res) => {
    // User and ageGroup are available in res.locals
    const { courseId, moduleIndex } = req.params;

    if (isNaN(parseInt(courseId)) || isNaN(parseInt(moduleIndex))) {
        return res.status(400).send('IDs de curso o módulo inválidos.');
    }

    // Fetch the specific module by course_id and its order/index
    // The OFFSET for LIMIT is 0-indexed.
    const actualModuleIndex = parseInt(moduleIndex); // Assuming moduleIndex from URL is 0-based for OFFSET

    const moduleQuery = `
        SELECT *, (SELECT COUNT(*) FROM course_modules WHERE course_id = cm.course_id) as total_modules
        FROM course_modules cm
        WHERE cm.course_id = ?
        ORDER BY cm.module_order ASC
        LIMIT 1 OFFSET ?;
    `;

    connection.query(moduleQuery, [courseId, actualModuleIndex], (error, moduleResults) => {
        if (error) {
            console.error('Error al cargar el módulo:', error);
            return res.status(500).send('Error interno del servidor');
        }
        if (moduleResults.length === 0) {
            return res.status(404).send('Módulo no encontrado');
        }
        const moduleData = moduleResults[0];

        // For next/prev module navigation
        const currentModuleOrder = moduleData.module_order; // Assuming you have module_order
        const totalModules = moduleData.total_modules;

        res.render('modulo', {
            module: {
                id: moduleData.id_course_module, // or whatever your primary key is
                title: moduleData.title,
                description: moduleData.description,
                url: moduleData.video_url, // Assuming video_url is the correct field
                order: currentModuleOrder, // The actual order from DB
                index: actualModuleIndex, // The 0-based index used for querying
                course_id: courseId,
                total_modules: totalModules
            }
        });
    });
};

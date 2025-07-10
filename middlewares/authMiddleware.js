exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // The global middleware in app.js should already set res.locals.user and res.locals.ageGroup
        // This middleware just checks for the session's existence.
        return next();
    }
    // Store the original URL they were trying to access, so we can redirect them back after login
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
};

// Example for role-based authorization (can be expanded later)
// Assumes user object in session has a 'role' property
exports.hasRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        const userRoles = Array.isArray(req.session.user.role) ? req.session.user.role : [req.session.user.role];
        const authorized = roles.some(role => userRoles.includes(role));

        if (authorized) {
            return next();
        }
        // If not authorized, perhaps redirect to a 'forbidden' page or home
        // For now, sending a 403 status
        res.status(403).send('Acceso denegado. No tienes los permisos necesarios.');
        // Or render a specific view:
        // res.status(403).render('error/403');
    };
};

module.exports = (req, res, next) => {
    if (req.decoded?.isAdmin !== true) {
        return res.status(403).json({
            status: false,
            error: 'Admin authority required!',
            data: null
        });
    }

    return next();
};

const routes = require('express').Router

routes
    .route('/viewblog/:slug')
    .get(getBlog)
routes
    .route('/postblog')
    .post(addBlog)

module.exports = routes
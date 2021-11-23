module.exports = (app) => {
    const Model = require('../../controllers/UserController')

    var router = require("express").Router();
    // return all documents
    router.get('/', Model.findAll);
    router.post('/login', Model.login);
    // router.get('/all', Model.findAllNodes);
    // return specific document by ID
    router.get('/:id', Model.findById);

    app.use('/api/v1/User',router);
}
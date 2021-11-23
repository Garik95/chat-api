const db = require('../models');
const Model = db.User;
const {
    nanoid
} = require('nanoid');

exports.findAll = (req, res) => {
    Model.find({}, {
        password: 0
    }).then((data) => {
        res.send(data)
    })
}

exports.login = (req, res) => {
    Model.findOne(req.body, {
        password: 0
    }).then(data => {
        res.send({
            token: nanoid(),
            data
        })
    }).catch(data => {
        res.send(data)
    })
}

exports.findById = (req, res) => {
    Model.findById(req.params.id).then(data => {
        res.send(data)
    }).catch(err => {
        res.send(err)
    })
}
// exports.create = (req, res) => {
//     Model.create().then((data) => {
//         res.send(data)
//     })
// }
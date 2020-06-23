const route = require('express').Router();
const verify = require('./verifyToken');


route.post('/', verify,(req, res) => {
    res.json({ posts: { title: 'teste title', description: 'descricao teste', user: req.user } });
});

module.exports = route;
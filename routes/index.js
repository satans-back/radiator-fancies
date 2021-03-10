let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('chat', { title: 'radiator' });
});

router.get('/chat', function(req, res, next) {
    res.render('room', { title: 'radiator' });
});

module.exports = router;
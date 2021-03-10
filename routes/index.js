let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('chat', { title: 'radiator' });
});

router.post('/chat', function(req, res, next) {
    console.log("CHAT MESSAGE:");
});

module.exports = router;
let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('chat', { title: 'radiator' });
});

module.exports = router;
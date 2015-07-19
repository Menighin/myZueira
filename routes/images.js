var express = require('express');
var router = express.Router();

router.get('/asdsadasda', function (request, response, next) {
    var path = __dirname + '/../pictures/1.jpg';

    console.log("fetching image: ", path);
    response.sendFile(path);
});

module.exports = router;
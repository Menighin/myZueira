var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var multer = require('multer');

var routes = require('./routes/index');
var users = require('./routes/users');
var canvas = require('./routes/canvas');

var database = {};

var app = express();
app.use(multer({dest:'public/images/'}).single('image'));

// Controllers
app.get('/images', function(req, res) {
	
	var dir = path.join(__dirname, 'public/images');
	var images = [];
	
	fs.readdirSync(dir).forEach(function(file) {
		images.push(req.get('host') + '/images/' + file);
	});
	
    res.json(images);
});

app.post('/uploadImage', function(req, res) {
	
    var tmp_path = path.join(__dirname, 'public/images/' + req.file.filename);
    var target_path = path.join(__dirname, 'public/images/' + req.file.originalname);
	
    // Rename the file
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        fs.unlink(tmp_path, function() {
            if (err)
                throw err;
            });
    });
	
	res.status(200).send('OK');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/canvas', canvas);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

var server = http.createServer(app).listen( app.get('port') );
var io = require('socket.io').listen(server, function() {
	console.log("Express server listening on port " + app.get('port'));
});


// A user connects to the server (opens a socket)
io.sockets.on('connection', function (socket) {
	
	socket.on('drawPath', function(data, room) {
		
		if (typeof database[room] === 'undefined')
			database[room] = [];
		
		database[room].push(data);
		
		io.in(room).emit('drawPath', data);
	});
	
	socket.on('subscribe', function(room) {
		socket.join(room);
		if (typeof database[room] != 'undefined' && database[room].length > 0)
			socket.emit('loadPaths', database[room]);
	});
	
});

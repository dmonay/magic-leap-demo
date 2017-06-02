var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
// view engine setup
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/wasm', function(req, res, next) {
  res.sendFile('test.html', {
    root: path.join(__dirname, 'views')
  });
});

app.use('/', function(req, res, next) {
  res.sendFile('index.html', {
    root: path.join(__dirname, 'views')
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

var http = require('http');
var port = 8090;
app.set('port', 8090);
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('listening on ', port);
}

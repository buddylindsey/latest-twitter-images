/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, http = require('http')
, jsonselect = require('JSONSelect');

var app = module.exports = express.createServer(), io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: true});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res, next){ 
  res.render('index', {locals: {'title': "Wasup"}});
  /* 

*/
});

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// code

io.sockets.on('connection', function (socket) {
  var since = null;

  get_images = function(){
    var options = {
      host: 'search.twitter.com',
      port: 80,
      path: '/search.json?q=imgur&amp;twitpic&amp;gif&amp;jpg&rpp=25&include_entities=true&result_type=recent&since_id=' + since || "",
    };

    http.get(options, function(res){
      var chunks = [];
      res.on('data', function (chunk) {
        chunks.push(chunk);
      });
      
      res.on('end', function () {
        var data = chunks.join('');
        var data_json = JSON.parse(data);
        since = data_json.max_id_str;
        socket.emit('images', jsonselect.match('.expanded_url', data_json ));
      }).on('error', function(e) {
        console.log("YO i broke: " + e.message);
      });


    });
  }
  
  get_images();
  var interval = setInterval(get_images, 5000);

  socket.on('disconnect', function(){
    clearInterval(interval);
  });
});

// http://search.twitter.com/search.json?q=imgur&rpp=25&include_entities=true&result_type=recent

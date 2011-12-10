/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, http = require('http')
, jsonselect = require('JSONSelect')
, _und = require('underscore');

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

var port = process.env.PORT || 4000

app.listen(port, function(){
  console.log("Listening on " + port);
});
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// code

function searchTerms(){
  var terms = [];

  terms.push("imgur");
  terms.push("twitpic");
  terms.push("jpg");
  terms.push("png");
  terms.push("gif");
  terms.push("yfrog");
  terms.push("plixi");
  terms.push("tweetphoto");
  terms.push("instagr");
  terms.push("imageshack");

  return terms.join("&amp;");
}

function getNewImages(all, recent){
  var no_repeats = _und.difference(recent, all);

  no_repeats.forEach(function(image){
    all.push(image);
  });
  
  return no_repeats;
}

io.sockets.on('connection', function (socket) {
  var since = null;
  var all_images = [];

  get_images = function(){
    var options = {
      host: 'search.twitter.com',
      port: 80,
      path: '/search.json?q=' + searchTerms() + '&rpp=25&include_entities=true&result_type=recent&since_id=' + since || "",
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

        var recent = jsonselect.match('.expanded_url', data_json );

        

        socket.emit('images', getNewImages(all_images, recent));
      }).on('error', function(e) {
        console.log("YO i broke: " + e.message);
      });


    });
  }
  
  get_images();
  var interval = setInterval(get_images, 15000);

  socket.on('disconnect', function(){
    clearInterval(interval);
  });
});



jQuery(function($) {
  
  var socket = io.connect(document.uri);
  
  var image_template = Handlebars.compile($('#image').html());
  
  socket.on('images', function(data){
    data.forEach(function(image){
      $("#images").append(image_template(image));
    });
  });
var socket = io.connect(document.uri);
socket.on('images', function(data){
  data.forEach(function(image){
    var img = $("<img />", {src:image});
    $("#images").append(img);
    $("#images").append(image);
  });
});
});

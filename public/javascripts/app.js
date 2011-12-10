
jQuery(function($) {
  
  var socket = io.connect('http://localhost:4000');
  
  var image_template = Handlebars.compile($('#image').html());
  
  socket.on('images', function(data){
    data.forEach(function(image){
      $("#images").append(image_template(image));
    });
  });

});

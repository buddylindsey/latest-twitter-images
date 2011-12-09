var socket = io.connect('http://localhost:4000');
socket.on('images', function(data){
  data.forEach(function(image){
    var img = $("<img />", {src:image});
    $("#images").append(img);
    $("#images").append(image);
  });
});



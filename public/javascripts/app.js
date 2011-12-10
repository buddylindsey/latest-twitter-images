var socket = io.connect('http://evening-light-2225.herokuapp.com/');
socket.on('images', function(data){
  data.forEach(function(image){
    var img = $("<img />", {src:image});
    $("#images").append(img);
    $("#images").append(image);
  });
});



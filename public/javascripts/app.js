var socket = io.connect(document.uri);
socket.on('images', function(data){
  data.forEach(function(image){
    var img = $("<img />", {src:image});
    $("#images").append(img);
    $("#images").append(image);
  });
});



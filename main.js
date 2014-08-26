var http = require('http');
var mjpegServer = require('mjpeg-server');
var chokidar = require('chokidar');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    console.log(1);
    mjpegReqHandler = mjpegServer.createReqHandler(req, res);
    console.log(2);
    var ch = chokidar.watch('../camera1/', {
	ignored: /\.tmp/,
	persistent: true,
	pollingInterval: 1000,
	ignoreInitial: true
    });
    var i = 0;
    ch.on('add', function(path) {
	console.log(path);
	setTimeout(function(){
	    fs.readFile(path, function(err, data){
		if (!err){
		    console.log("ok");
		    mjpegReqHandler.update(data);
		}
	    })}, 1000);
    });
    req.on('close', function(){
	console.log("done");
	ch.close();
    });

});

server.listen(8081);
console.log("started");

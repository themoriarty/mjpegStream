var http = require('http');
var mjpegServer = require('mjpeg-server');
var chokidar = require('chokidar');
var fs = require('fs');
var url = require('url');
var cfg = require('./config');

function index(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    for (folder in cfg.folders){
	res.write("<p><img src='" + folder + "'></p>");
    }
    res.end();
}

var server = http.createServer(function(req, res) {
    var url_parts = url.parse(req.url);
    console.log(url_parts);
    if (url_parts.pathname == "/"){
	return index(req, res);
    }
    var folder = cfg.folders[url_parts.pathname.replace('/', '')];
    if (folder){
	var mjpegReqHandler = mjpegServer.createReqHandler(req, res);

	var ch = chokidar.watch(folder, {
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
    } else{
	res.writeHead(404);
	res.end();	
    }
});

server.listen(8081);
console.log("started");

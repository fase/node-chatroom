var http = require('http'),
		fs = require('fs'),
		path = require('path'),
		mime = require('mime'), 
		chatServer = require('./lib/chat_server'),
		cache = {};

// Create http server using anonymous function to define per-request behavior.
var server = http.createServer(function(request, response) {
	var filePath = path.dirname(require.main.filename) + '/public/';

	// Determine html file to be served by default.
	if(request.url == '/') {
		filePath += 'index.html';
	} else {
		// Translate url path to relative file path.
		filePath += request.url;
	}

	// Serve static file.
	serveStatic(response, cache, filePath);
});


server.listen(3000, function() {
	console.log('Server listening on port 3000...');
});


chatServer.listen(server);


function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
	response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
	// Check if file is cached in memory
	if(cache[absPath]) {
		// Serve file from memory
		sendFile(response, absPath, cache[absPath]);
	} else {
		// Check if file exists
		fs.exists(absPath, function(exists) {
			if(exists) {
				// Read file from disk
				fs.readFile(absPath, function(err, data) {
					if(err) {
						send404(response);
					} else {
						cache[absPath] = data;

						// Serve file read from disk
						sendFile(response, absPath, data);
					}
				});
			} else {
				// Send HTTP 404 response
				send404(response);
			}
		});
	}
}

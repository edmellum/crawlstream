var http = require('http');

var async = require('async');

var crawlstream = require('./index');

// Create a server on a port one up from the last server.
// Emit an event on the server every time it is visited.
var createServer = function(callback) {
	if(!this.port) this.port = 6767;
	this.port += 1;

	var server = http.createServer(function (req, res) {
		server.emit(req.url, req, res);
	});

	server.url = 'http://localhost:' + port;

	server.listen(port, function() {
		callback(null, server);
	});
};

// Basic crawling
createServer(function(err, server) {
	server.once('/', function(req, res) {
		res.write('<div><a href="/pagetwo"></a></div>');
		res.end();
		server.once('/pagetwo', function(req, res) {
			console.log('Basic crawling ✓');
			res.end();
			server.close();
		});
	});

	crawlstream(server.url, 10)
});

// Follow redirects
// Make two servers and have one redirect to the other one. If the
// second receives a request we're all good.
createServer(function(err, server) {

		server.once('/', function(req, res) {
			res.write('<div><a href="'+ server.url +'/pagetwo"></a></div>');
			res.end();
		});

		server.once('/pagetwo', function(req, res) {
			res.writeHead(302, {
				'Location': server.url + '/pagethree'
			});
			res.end();
		});

		server.once('/pagethree', function(req, res) {
			console.log('Follow redirects URL ✓');
			res.end();
			server.close();
		});

		crawlstream(server.url, 10);
});
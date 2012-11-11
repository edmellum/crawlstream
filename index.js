var http = require('http');
var Stream = require('stream');

var async = require('async');
var request = require('request');
var trumpet = require('trumpet');

// Crawl all pages namespaces to `rootUrl` with `concurrency`
// specifying the amount of concurrent connection. `callback`
// will be called at every page visit with the request object.
module.exports = function(rootUrl, concurrency, callback) {
	if(!callback) callback = function(){};

	var stream = new Stream;
	stream.readable = true;
	stream.headers = {};

	// Every visited url goes in visited to avoid revisiting
	var visited = [];

	// Takes a node from trumpet and returns a URL if it has not
	// been visited and is valid.
	var getUrl = function(link) {
		var href = link.attributes.href;

		if(!href) return;
		if(href[0] !== '/' && href.indexOf(rootUrl) === -1) return;

		// Make absolute paths into URLs
		if(href[0] === '/') {
			href = rootUrl + href;
		}

		if(visited.indexOf(href) === -1) {
			return href;
		}
	};

	var crawl = function(url, callback) {
		var tr = trumpet();
		var req = request(url, {pool: {maxSockets: concurrency}});

		tr.select('a', function(node) {
			var url = getUrl(node);

			if(!url) return;

			visited.push(url);

			queue.push(url, function(err, url) {
				if(err) throw err;
			});
		});

		tr.once('end', function() {
			callback(null, req);
		});

		tr.on('error', callback);
		req.on('error', callback);

		req.once('response', function(res) {
			var type = res.headers['content-type'];
			
			if(type && type.indexOf('text/html') === -1) {
				tr.end();
				req.end();
				return;
			}

			req.pipe(tr);
		});

		stream.emit('data', req);
	};

	var queue = async.queue(crawl, concurrency);

	queue.drain = function() {
		stream.emit('end');
	};

	crawl(rootUrl, callback);

	return stream;
};
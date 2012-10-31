# crawlstream

A website crawler that gives a readable stream of request streams.

Development of this module has been sponsored by [Knowit](http://knowit.no)

[![Build Status](https://secure.travis-ci.org/edmellum/crawlstream.png)](http://travis-ci.org/edmellum/crawlstream)

## Installation
```bash
$ npm install crawlstream
```

## Running the tests
```bash
$ npm test
```

# Examples

## Printing out the paths of all the pages found.
**Streaming API**
```javascript
var crawlstream = require('crawlstream');

crawlstream('mysite.com', 10)
	.on('data', function(req) {
		console.log(req.uri.path);
	});
```

**Callback API**
```javascript
var crawlstream = require('crawlstream');

crawlstream('mysite.com', 10, function(err, req) {
	console.log(req.uri.path);
});
```

# Methods
```javascript
var crawlstream = require('crawlstream')
```

## crawlstream(baseUrl, concurrency, [callback])
Crawl all pages under baseUrl.

Optionally supply a callback(err, req) which will receive
the request stream(!) for all pages.

# License
Copyright 2012 Knowit

MIT
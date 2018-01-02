const http = require('http');
const url = require('url');
const fs = require('fs');
const publicPath = '../public/';
const port = 3000;

http.createServer(function(req, res) {

  var purl = url.parse(req.url, true);
  if (purl.pathname == '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile(publicPath + 'index.html', function(err, data) {
      if (err) throw err;
      res.end(data);
    });
  } else {
    fs.exists(publicPath + purl.pathname, function(exists) {
      if (exists) {
        var extention = purl.pathname.match(/\..+$/)[0];
        var mime = {
          '.js': 'text/javascript; charset=UTF-8',
          '.txt': 'text/plain; charset=UTF-8',
          '.html': 'text/html; charset=UTF-8',
          '.css': 'text/css',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.jpg': 'image/jpeg'
        }

        res.writeHead(200, {'Content-Type': mime[extention]});
        fs.readFile(publicPath + purl.pathname, function(err, data) {
          if (err) throw err;
          res.end(data);
        });

      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('File Not Found');
      }
    });

  }

}).listen(port);
console.log(`Server running at port ${port}`);

// Imports
const http = require('http');
const url = require('url')
const dbtest = require('./dbtest');
const app = require('./app');

// Define port as environment variable, 8080 if not defined
const port = process.env.PORT || 8080;

//Testing Function
function onTest(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.write(req.url + ' received' + "\n");
    res.end();
}

// Create a server object and run app on request. 
//var server = http.createServer(dbtest);
var server = http.createServer(app);
// Server listens on port
server.listen(port); 
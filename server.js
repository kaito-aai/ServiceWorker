// const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const ssl_server_key = 'server_key.pem';
const ssl_server_crt = 'server_crt.pem';

const options = {
    key: fs.readFileSync(ssl_server_key),
    cert: fs.readFileSync(ssl_server_crt)
};

const port = 3000;

const server = https.createServer(options, (req, res) => {
    let filePath = '.' + req.url;
    if (filePath == './') {
        filePath = './main.html';
    }

    let extname = String(path.extname(filePath)).toLowerCase();
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript'
    }
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("no such file or directory");
                res.end();
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}).listen(port);

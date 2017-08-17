const fs = require('fs');
const http = require('http');
const path = require('path');
const process = require('process');

const PORT = 3000;
const sourceFile = path.resolve(__dirname, 'src', 'index.html');

http.createServer((request, response) => {
  fs.readFile(sourceFile, 'utf8', ((error, data) => {
    if (error) {
      console.log('Reading file:', error);
      process.exit(1);
    }
  
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    response.end();
  }));
}).listen(PORT);

console.log(`Started a server at port ${PORT}`);

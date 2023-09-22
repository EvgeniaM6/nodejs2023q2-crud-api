import http from 'http';
import process from 'node:process';
 
const hostname = '127.0.0.1';
const port = 4000;

const server = http.createServer((req, res) => {
  console.log('req.url=', req.url);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});
 
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit());
});

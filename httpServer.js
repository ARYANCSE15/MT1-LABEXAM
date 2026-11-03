import http from 'http';

const server = http.createServer((req, res) => {

    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.end('<h1>Welcome to Employee Task Management System</h1>');

});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Employee tasks array
const tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Create Dashboard",
        assignedTo: "Amit Kumar",
        status: "Completed"
    },
    {
        id: 3,
        taskName: "Design Homepage",
        assignedTo: "Priya Singh",
        status: "Pending"
    }
];

// Create HTTP server
const server = http.createServer((req, res) => {

    // Extract pathname without query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const route = url.pathname;

    console.log("Requested URL:", req.url);
    console.log("Request Method:", req.method);

    // Route 1: Home page
    if (route === "/" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to Employee Task Management System</h1>");
    }

    // Route 2: Get all tasks
    else if (route === "/tasks" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(tasks));
    }

    // Route 3: About page
    else if (route === "/about" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>Employee Task Management Application</h1>
            <p>This application helps manage employee tasks efficiently.</p>
        `);
    }

    // Route 4: Serve HTML using FS module
    else if (route === "/home" && req.method === "GET") {

        const filePath = path.join(__dirname, "public", "index.html");

        fs.readFile(filePath, "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Error reading HTML file");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    }

    // Route 5: Add a new task
    else if (route === "/add-task" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {
                const newTask = JSON.parse(body);

                // Validate required fields
                const { id, taskName, assignedTo, status } = newTask;

                if (
                    id === undefined ||
                    !taskName ||
                    !assignedTo ||
                    !status
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "All required fields must be provided"
                    }));

                    return;
                }

                // Check duplicate ID
                if (tasks.some(task => task.id === id)) {
                    res.writeHead(409, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "Task ID already exists"
                    }));

                    return;
                }

                tasks.push(newTask);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Task added successfully",
                    task: newTask
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON request"
                }));
            }
        });
    }

    // Invalid route or method
    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
    }

});

// Start server on port 3000
server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});

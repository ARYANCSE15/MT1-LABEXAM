
import express from 'express';

const app = express();
const PORT = 4000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Sample task data (no database required)
let tasks = [
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

// 1. GET - Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json({
        message: "All tasks retrieved successfully",
        tasks: tasks
    });
});

// 2. GET - Retrieve a task by ID
app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.status(200).json({
        message: "Task retrieved successfully",
        task: task
    });
});

// 3. POST - Create a new task
app.post('/tasks', (req, res) => {
    const { id, taskName, assignedTo, status } = req.body;

    if (id === undefined || !taskName || !assignedTo || !status) {
        return res.status(400).json({
            message: "Please provide id, taskName, assignedTo and status"
        });
    }

    if (tasks.some(t => t.id === Number(id))) {
        return res.status(409).json({
            message: "Task ID already exists"
        });
    }

    const newTask = {
        id: Number(id),
        taskName,
        assignedTo,
        status
    };

    tasks.push(newTask);

    res.status(201).json({
        message: "Task created successfully",
        task: newTask
    });
});

// 4. PUT - Update a task by ID
app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const { taskName, assignedTo, status } = req.body;

    if (!taskName || !assignedTo || !status) {
        return res.status(400).json({
            message: "Please provide taskName, assignedTo and status"
        });
    }

    tasks[taskIndex] = {
        id: id,
        taskName,
        assignedTo,
        status
    };

    res.status(200).json({
        message: "Task updated successfully",
        task: tasks[taskIndex]
    });
});

// 5. DELETE - Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1);

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.status === 400
            ? "Invalid JSON data"
            : "Internal Server Error"
    });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});

import express, { Request, Response } from "express";
import Task from "../model/task.model";

const router = express.Router();

// Get all tasks
router.get("/tasks", async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get task by ID
router.get("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Create a new task
router.post("/tasks", async (req: Request, res: Response) => {
    try {
        const { title, description, status, priority, deadline } = req.body;
        const task = new Task({ title, description, status, priority, deadline });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: "Invalid Task Data" });
    }
});

// Update a task
router.put("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete a task
router.delete("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;

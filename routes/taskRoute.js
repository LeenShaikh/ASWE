const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

//! POST /tasks/add
router.post('/add', async (req, res) => {
    try {
        const { Collaboration_ID, User_ID, Description, Deadline, Status } = req.body;
        const collection = req.db.collection('task');
        
        const newProject = {
            Collaboration_ID,
            User_ID,
            Description,
            Deadline,
            Status
        };

        const insertResult = await collection.insertOne(newProject);
        
        res.status(200).json("Task added successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const collection = req.db.collection('task');
        const deleteResult = await collection.deleteOne({ "_id": new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json("task not found");
        }
        res.status(200).json("task deleted successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// PUT /tasks/update/:id
router.put('/update/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const collection = req.db.collection('task');
        const existingTask = await collection.findOne({ "_id": new ObjectId(taskId) }); 
        if (!existingTask) {
            return res.status(404).json("Task not found");
        }
        const updatedTask = {
            ...existingTask,
            Description: req.body.Description || existingTask.Description,
            Deadline: req.body.Deadline || existingTask.Deadline,
            Status: req.body.Status || existingTask.Status,
            Collaboration_ID: req.body.Collaboration_ID || existingTask.Collaboration_ID,
            User_ID: req.body.User_ID || existingTask.User_ID
        };
        const updateResult = await collection.updateOne({ "_id": new ObjectId(taskId) }, { $set: updatedTask }); 
        res.status(200).json("Task updated successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// GET /tasks/
router.get('/', async (req, res) => {
    try {
        const collection = req.db.collection('task');
        const task = await collection.find({}).toArray();
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// GET /tasks/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = req.db.collection('task');
        const project = await collection.findOne({ "_id": new ObjectId(id) });
        if (!project) {
            return res.status(404).send('task not found');
        }
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// GET /tasks/by-collaboration/:collaborationId
router.get('/by-collaboration/:collaborationId', async (req, res) => {
    try {
        const { collaborationId } = req.params;
        const collection = req.db.collection('task');
        const tasks = await collection.find({ Collaboration_ID: collaborationId }).toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// GET /tasks/status/:id
router.get('/status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = req.db.collection('task');
        const task = await collection.findOne({ "_id": new ObjectId(id) });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ status: task.Status });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});



module.exports = router;



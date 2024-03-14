const express = require('express');
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb'); 

//POST /project/add
router.post('/add', async (req, res) => {
    try {
        const { Name, Description, Skill_Level, Materials_Required, Group_Size, Category } = req.body;
        const collection = req.db.collection('project');
        
        const newProject = {
            Name,
            Description,
            Skill_Level,
            Materials_Required,
            Group_Size,
            Category
        };

        const insertResult = await collection.insertOne(newProject);
        
        res.status(200).json("Project added successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});


// DELETE /project/:id
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const collection = req.db.collection('project');
        const deleteResult = await collection.deleteOne({ "_id": new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json("Project not found");
        }
        res.status(200).json("Project deleted successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// PUT /project/update/:id
router.put('/update/:id', async (req, res) => {
    try {
        const projId = req.params.id;
        const collection = req.db.collection('project');
        const existingProject = await collection.findOne({ "_id": new ObjectId(projId) }); 
        if (!existingProject) {
            return res.status(404).json("Project not found");
        }
        const updatedProject = {
            ...existingProject,
            Name: req.body.Name || existingProject.Name,
            Description: req.body.Description || existingProject.Description,
            Skill_Level: req.body.Skill_Level || existingProject.Skill_Level,
            Materials_Required: req.body.Materials_Required || existingProject.Materials_Required,
            Group_Size: req.body.Group_Size || existingProject.Group_Size,
            Category: req.body.Category || existingProject.Category,

        };
        const updateResult = await collection.updateOne({ "_id": new ObjectId(projId) }, { $set: updatedProject }); 
        res.status(200).json("Project updated successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
// GET /project/projects
router.get('/projects', async (req, res) => {
    try {
        const collection = req.db.collection('project');
        const projects = await collection.find({}).toArray();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// GET /project/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = req.db.collection('project');
        const project = await collection.findOne({ "_id": new ObjectId(id) });
        if (!project) {
            return res.status(404).send('project not found');
        }
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
// GET /project/categor/:category
router.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const collection = req.db.collection('project');
        const projectsWithCategory = await collection.find({ Category : category }).toArray();
        res.status(200).json(projectsWithCategory);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});



module.exports = router;



const express = require('express');
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb'); 

//POST /showCase/add
router.post('/add', async (req, res) => {
    try {
        const { projId, userId, Description,Images } = req.body;
        const collection = req.db.collection('showCase');
        
        const newShowCase = {
            projId, userId, Description,Images
        };

        const insertResult = await collection.insertOne(newShowCase);
        
        res.status(200).json("showCase added successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});


// DELETE /showCase/:id
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const collection = req.db.collection('showCase');
        const deleteResult = await collection.deleteOne({ "_id": new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json("showCase not found");
        }
        res.status(200).json("showCase deleted successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// PUT /showCase/update/:id
router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const collection = req.db.collection('showCase');
        const existingShowCase = await collection.findOne({ "_id": new ObjectId(id) }); 
        if (!existingShowCase) {
            return res.status(404).json("showCase not found");
        }
        const updatedShowCase = {
            ...existingShowCase,
            Description: req.body.Description || existingShowCase.Description,
            Images: req.body.Images || existingShowCase.Images

        };
        const updateResult = await collection.updateOne({ "_id": new ObjectId(id) }, { $set: updatedShowCase }); 
        res.status(200).json("showCase updated successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
// GET /showCase/showCases
router.get('/showCases', async (req, res) => {
    try {
        const collection = req.db.collection('showCase');
        const showCases = await collection.find({}).toArray();
        res.status(200).json(showCases);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// GET /showCase/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = req.db.collection('showCase');
        const showCase = await collection.findOne({ "_id": new ObjectId(id) });
        if (!showCase) {
            return res.status(404).send('showCase not found');
        }
        res.status(200).json({ success: true, data: showCase });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
// GET /showCase/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const collection = req.db.collection('showCase');
        const showCaseUser = await collection.find({ userId : userId }).toArray();
        res.status(200).json(showCaseUser);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});



module.exports = router;



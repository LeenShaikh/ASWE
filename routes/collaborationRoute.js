const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

//! POST /collaborations
router.post('/', async (req, res) => {
    try {
        const collaboration = req.body;
        const collection = req.db.collection('collaboration');
        const insertCollaboration= await collection.insertOne(collaboration);
        res.status(201).json({ success: true, data: insertCollaboration});
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

//! GET /collaborations
router.get('/', async (req, res) => {
    try {
        const collection = req.db.collection('collaboration');
        const allCollaborations = await collection.find({}).toArray();
        res.status(200).json({ success: true, data: allCollaborations });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

//! GET /collaborations/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = req.db.collection('collaboration');
        const findCollaboration = await collection.findOne({ "_id": new ObjectId(id) });
        if (!findCollaboration) {
            return res.status(404).send('Collaboration not found');
        }
        res.status(200).json({ success: true, data: findCollaboration });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

//! PUT /collaborations/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collaboration = req.body;
        const collection = req.db.collection('collaboration');
        const updateCollection = await collection.updateOne({
             "_id": new ObjectId(id) }, { $set: collaboration 
            });
        res.status(200).json( { success: true, data: updateCollection });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

//! DELETE /collaborations/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = req.db.collection('collaboration');
        const deleteCollection = await collection.deleteOne({
             "_id": new ObjectId(id) 
            });
        res.status(200).json({ success: true, data: deleteCollection });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

//! GET /collaborations/status/:status
router.get('/status/:status', async (req, res) => {
    try {
        const {status} = req.params;
        const collection =  req.db.collection('collaboration');

        const collaboration = await collection.find({
        Status: { $regex: new RegExp('^' + status + '$') } }).toArray();
        if (!collaboration) {
          return  res.status(404).send('Collaboration not found');
        }
    
      return   res.status(200).json({ success: true, data: collaboration });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//! GET /collaborations/updateStatus/:id
router.get('/checkComplete/:id', async (req, res) => {
    try {
      const {id} = req.params;
      
      const collaboration = req. db.collection('collaboration');
      const findCollaboration = await collaboration.findOne({ "_id": new ObjectId(id) });
      console.log("findCollaboration");
      console.log(findCollaboration);
      
      const task =  req.db.collection('task ');
      const tasks = await task.find({"Collaboration_ID" : id} ).toArray();
      console.log("tasks");
      console.log(tasks);
      if (! tasks) {
        return res.status(404).json({ msg: 'No tasks found for this collaboration' });
      }
      
      const CheckCompleted = tasks.every((task)=> task.Status === 'Complete');
      
      console.log("Check All Completed",CheckCompleted);
      
      if (CheckCompleted) {
        const update = await collaboration.updateOne({ "_id": new ObjectId(id) },
        { $set:  { Status: 'Complete' }  });
        res.status(200).json(update);
      } else {
        res.status(400).json({ msg: 'Not all tasks are completed yet' });
      }
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router

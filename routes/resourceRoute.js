const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

//! POST /resources
router.post('/', async (req, res) => {
    try {
        const collaboration = req.body;
        const collection = req.db.collection('resource');
        const insertResource= await collection.insertOne(collaboration);
        res.status(201).json({ success: true, data: insertResource});
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

//! GET /resources
router.get('/', async (req, res) => {
    try {
        const collection = req.db.collection('resource');
        const allResource = await collection.find({}).toArray();
        res.status(200).json({ success: true, data: allResource });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

//! GET /resources/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = req.db.collection('resource');
        const findResource = await collection.findOne({ "_id": new ObjectId(id) });
        if (!findResource) {
            return res.status(404).send('Collaboration not found');
        }
        res.status(200).json({ success: true, data: findResource });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

//! PUT /resources/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collaboration = req.body;
        const collection = req.db.collection('resource');
        const updateResource = await collection.updateOne({
             "_id": new ObjectId(id) }, { $set: collaboration 
            });
        res.status(200).json( { success: true, data: updateResource });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

//! DELETE /resources/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = req.db.collection('resource');
        const deleteResource= await collection.deleteOne({
             "_id": new ObjectId(id) 
            });
        res.status(200).json({ success: true, data: deleteResource });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

//! GET /resources/name/:name
router.get('/name/:name', async (req, res) => {
    try {
        const {name} =  req.params;
        const collection = req.db.collection('resource');
  
   const resources = await collection.find({
     Name: { $regex: new RegExp('^' + name + '$') 
    } }).toArray();

      if (! resources) {
        return res.status(404).json({ msg: 'No resources found with that name' });
      }
      res.json({ success: true, data: resources });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
//! GET /resources/location/:location
router.get('/location/:location', async (req, res) => {
    try {
        const {location} =  req.params;
        const collection = req.db.collection('resource');
  
        const resources = await collection.find({
           Location: { $regex: new RegExp('^' + location + '$')
           } }).toArray();

      if (!resources) {
        return res.status(404).json({ msg: 'No resources found in that location' });
      }
      res.json({ success: true, data: resources });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router

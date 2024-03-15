const express = require('express');
const router = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb'); 

// POST /login
router.post('/login', async (req, res) => {
    try {
        console.log("inside login");
        const collection = req.db.collection('user');
        const result = await collection.findOne({ Email: req.body.Email });

        if (!result) {
            console.log("email is incorrect");
            return res.status(403).json("Email is incorrect");
        }

        if (result.Password === req.body.Password) {
            let token = jwt.sign({ Email: req.body.Email }, config.key, {});
            console.log("login!");
            res.json({
                token: token,
                msg: "success",
            });
        } else {
            res.status(403).json("password is incorrect");
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// POST /signup
router.post('/signup', async (req, res) => {
    try {
        const collection = req.db.collection('user');
        const existingUser = await collection.findOne({ Email: req.body.Email });
        if (existingUser) {
            return res.status(400).json("Email already exists");
        }
        const newUser = {
            Username: req.body.Username,
            Email: req.body.Email,
            Password: req.body.Password, 
            Craft_Skills: req.body.Craft_Skills || [],
            Interests: req.body.Interests || [],
            Contact_Information: req.body.Contact_Information || ""
        };
        const insertResult = await collection.insertOne(newUser);
        res.status(201).json(insertResult.ops[0]);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// DELETE /user/:id
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const collection = req.db.collection('user');
        const deleteResult = await collection.deleteOne({ "_id": new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json("User not found");
        }
        res.status(200).json("User deleted successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
// PUT /user/update/:id
router.put('/update/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const collection = req.db.collection('user');
        const existingUser = await collection.findOne({ "_id": new ObjectId(userId) }); 
        if (!existingUser) {
            return res.status(404).json("User not found");
        }
        const updatedUser = {
            ...existingUser,
            Username: req.body.Username || existingUser.Username,
            Password: req.body.Password || existingUser.Password,
            Craft_Skills: req.body.Craft_Skills || existingUser.Craft_Skills,
            Interests: req.body.Interests || existingUser.Interests,
            Contact_Information: req.body.Contact_Information || existingUser.Contact_Information
        };
        const updateResult = await collection.updateOne({ "_id": new ObjectId(userId) }, { $set: updatedUser }); 
        res.status(200).json("User updated successfully");
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
// GET /user/users
router.get('/users', async (req, res) => {
    try {
        const collection = req.db.collection('user');
        const users = await collection.find({}).toArray();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// GET /user/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = req.db.collection('user');
        const user = await collection.findOne({ "_id": new ObjectId(id) });
        if (!user) {
            return res.status(404).send('user not found');
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
// GET /user/interest/:interest
router.get('/interest/:interest', async (req, res) => {
    try {
        const interest = req.params.interest;
        const collection = req.db.collection('user');
        const usersWithInterest = await collection.find({ Interests: interest }).toArray();
        res.status(200).json(usersWithInterest);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
// GET /user/skill/:skill
router.get('/skill/:skill', async (req, res) => {
    try {
        const skill = req.params.skill;
        const collection = req.db.collection('user');
        const usersWithSkill = await collection.find({ Craft_Skills: skill }).toArray();
        res.status(200).json(usersWithSkill);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});



module.exports = router;



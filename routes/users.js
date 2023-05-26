

// /users

const { ObjectId } = require("mongodb");

const db = global.db;

const fs = require("fs");
const { v4: uuidv4, v4 } = require('uuid');
const config = require("../config");

// /users/*


module.exports.findUsers = async (req, res) => {
    console.log(req.params);

    if (!req.user) {
        res.status(401).send();
        return;
    }


    let users = db.collection("users").find({ login: /^(req.body.filter)/ }).toArray();

    res.json(users);
}

module.exports.getUsers = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    let users = await db.collection("users").find().toArray();
    res.json(users);

}

module.exports.getUser = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }


    let query = {_id : ObjectId(req.params.id)}
    let user = await db.collection("users").findOne(query);

    if(user.imagepath)
        user.image = Array.from(fs.readFileSync(user.imagepath));

    res.json(user);
}

module.exports.addUser = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    

    req.body._id = ObjectId(req.body._id);
    
    if(req.user._id.equals(req.body._id)){
        if(req.body.image){
            req.body.imagepath = config.file_storage + uuidv4();
            fs.writeFileSync(req.body.imagepath, Buffer.from(req.body.image));
            delete req.body.image;

        }
        
        const options = { upsert: true, returnOriginal: false };

        await db.collection("users").findOneAndUpdate({_id: req.body._id}, {$set: req.body}, options);
        res.sendStatus(200);
        return;
    }

    res.sendStatus(400);
}

module.exports.deleteUser = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
}

module.exports.updateUser = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }


    res.send(401);
}
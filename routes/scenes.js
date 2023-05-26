

const { ObjectId } = require("mongodb");
const fs = require("fs");
const { v4: uuidv4, v4 } = require('uuid');
const config = require("../config");

const db = global.db;


module.exports.getModels = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    let models = await db.collection("models").find({}).toArray();

    res.json(models);
};


module.exports.addModel = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }


    req.body.model = ObjectId(req.body.model);
    

    if (req.body._id) {
        req.body._id = ObjectId(req.body._id);
        await db.collection("models").findOneAndUpdate({ _id: req.body._id }, { $set: req.body })
    }
    else
        await db.collection("models").insertOne(req.body);


    res.sendStatus(200);
};

module.exports.getModel = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    let query = { _id: ObjectId(req.params._id) };

    let models = await db.collection("models").findOne(query);

    res.json(models);
};


module.exports.postScene = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

};


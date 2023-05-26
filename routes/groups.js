const { ObjectId } = require("mongodb");
const fs = require("fs");
const { v4: uuidv4, v4 } = require('uuid');
const config = require("../config");

const db = global.db;




module.exports.getGroup = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    let group = await db.collection('groups').findOne({ _id: ObjectId(req.params.id) });
    group.image = Array.from(fs.readFileSync(group.imagepath));


    res.send(group);
}



module.exports.getGroups = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    let groups = await db.collection("groups").find({ users: { $elemMatch: { $in: [req.user._id] } } }).toArray();


    res.json(groups);
}

module.exports.addGroup = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    req.body.imagepath = config.file_storage + uuidv4();
    fs.writeFileSync(req.body.imagepath, Buffer.from(req.body.image));

    req.body.users = req.body.users.map(e => ObjectId(e));

    delete req.body.image;

    await db.collection("groups").insertOne(req.body);

    res.send();
}

module.exports.deleteGroup = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }


}
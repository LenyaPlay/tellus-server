
const { ObjectId } = require("mongodb");
const fs = require("fs");
const { v4: uuidv4, v4 } = require('uuid');
const config = require("../config");

const db = global.db;


module.exports.uploadFile = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }


    const { group_id, file_id } = req.params;

    let file = await db.collection("files").findOne({ _id: ObjectId(file_id) });

    if (!file) {
        res.sendStatus(404);
        return;
    }

    console.log("yes");


    const filePath = file.path; // replace with your desired file path
  
    // Write the request body to the file
    fs.writeFile(filePath, req.body, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Unable to save request body to file');
      } else {
        res.send('Request body saved to file');
      }
    });
};

module.exports.downloadFile = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    const { group_id, file_id } = req.params;

    let file = await db.collection("files").findOne({ _id: ObjectId(file_id) });

    if (!file) {
        res.sendStatus(404);
        return;
    }


    res.sendFile(file.path, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error sending file');
        } else {
            console.log(`File sent: ${file.path}`);
        }
    });
};


module.exports.postFile = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    const { group_id, file_id } = req.params;


    if (file_id) {
        console.log('no implementation');
        return;
    }

    req.body.path = config.file_storage + uuidv4() + req.body.name;
    let result = await db.collection("files").insertOne(req.body);
    await db.collection("groups").findOneAndUpdate({ _id: ObjectId(group_id) }, { $push: { files: result.insertedId } });


    req.body._id = result.insertedId;

    res.json(req.body);
    return;

}


module.exports.getFile = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    const { group_id, file_id } = req.params;
    let file = await db.collection("files").findOne({ _id: ObjectId(file_id) });

    if (!file) {
        res.sendStatus(404);
        return;
    }

    res.json(file);
}

module.exports.getFiles = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    const { group_id } = req.params;

    let group = await db.collection("groups").findOne({ _id: ObjectId(group_id) });


    if (!group || !group.files) {
        res.json([]);
        return
    }

    let files = await db.collection("files").find({ _id: { $in: group.files } }).toArray();


    res.json(files);
}

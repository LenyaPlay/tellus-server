const { ObjectId } = require("mongodb");


const db = global.db;


module.exports.getMessage = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    let message = await db.collection("messages").findOne({_id : ObjectId(req.params.id)});

    res.json(message);
}

module.exports.sendMessage = async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }


    req.body.user = req.user._id;
    req.body.sendDate = Date.now();

    let result = await db.collection("messages").insertOne(req.body);

    await db.collection("groups").findOneAndUpdate({_id : ObjectId(req.params.id)}, {$push : {messages : result.insertedId}});
    console.log(req.params);

    res.send();
}
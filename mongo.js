const MongoClient = require("mongodb").MongoClient;


const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);


try {
    mongoClient.connect().then(mongoClient => {
        console.log("Подключение с БД установлено");
    });
}
catch {

}

module.exports.db = mongoClient.db("usersdb");


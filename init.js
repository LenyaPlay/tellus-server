const config = require("./config");
const db = global.db;


module.exports.autoCreateAdmin = async () => {

    let users = await db.collection("users").find().toArray();

    if(users.length == 0){
        let user = {
            login: config.admin.login,
            email: config.admin.email,
            password: config.admin.password,
        }
    
        await db.collection("users").insertOne(user);

        console.log("Администратор создан: ", user);
    }
}

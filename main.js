
const express = require('express')

const fs = require('fs');
const transporter = require('./mail').transporter;
const db = require('./mongo').db;


global.fs = fs;
global.db = db;
global.transporter = transporter;

const init = require("./init");

const auth = require('./routes/auth');
const users = require('./routes/users');
const groups = require('./routes/groups');
const messages = require('./routes/messages');
const scenes = require('./routes/scenes');

const groups_files = require('./routes/groups-files')

app = express();

init.autoCreateAdmin();

app.use(express.json({ limit: '50mb', type: 'application/json' }));
app.use(express.raw({ limit: '50mb', type: 'application/octet-stream' }));
app.use(auth.jwtMiddleware);


app.post('/signin', auth.signin);
app.post('/signup', auth.signup);


app.get('/users', users.getUsers);
app.get('/users/find')
app.get('/users/:id', users.getUser);
app.post('/users', users.addUser);
app.put('/users', users.updateUser);
app.delete('/users', users.deleteUser);


app.get('/models', scenes.getModels);
app.get('/models/:id', scenes.getModel);
app.post('/models', scenes.addModel);


app.post("/groups", groups.addGroup);
app.get("/groups", groups.getGroups);
app.get("/groups/:id", groups.getGroup);


app.post("/groups/:group_id/files/:file_id/upload", groups_files.uploadFile);
app.get("/groups/:group_id/files/:file_id/download", groups_files.downloadFile);

app.post("/groups/:group_id/files/:file_id?", groups_files.postFile);
app.get('/groups/:group_id/files/:file_id', groups_files.getFile);

app.get('/groups/:group_id/files', groups_files.getFiles);

app.post("/groups/messages/:id", messages.sendMessage);
app.get("/messages/:id", messages.getMessage);

app.get('/activate/*', auth.activate);
let ip = "192.168.1.69"
ip = "127.0.0.1"
ip = "192.168.23.204"


app.listen(80, ip, () => {
    console.log(`Сервер запущен на порту ${80}`);
})

//I think, that it is dont work
process.on('exit', code => {
    mongoClient.close().then(() => {
        console.log("Соединение с БД закрыто");
    })
})


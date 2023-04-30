const MongoClient = require("mongodb").MongoClient;
const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');
const config = require('./config')

const transporter = nodemailer.createTransport({
    service: 'mail',
    host: "smtp.mail.ru",
    port: 465 ,
    secure: true, // true for 465, false for other ports
    auth: {
        user: config.mail.user,
        pass: config.mail.password,
    }
})

const mailConfirmationMailOptions = {
    from: 'lenyaplay@mail.ru',
    subject: 'Sending Email using Node.js',
};

app = express();

app.use(bodyParser.json());

app.post('/signin', (req, res) => {
    console.log(req.body);

    mailOptions = {
        ...mailConfirmationMailOptions,
        to:req.body.email,
        html: "<h1>ПОДТВЕРЖДЕНИ</h1>"
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.send(req.body);
});

app.listen(80, '192.168.1.69', () => {
    console.log(`Сервер запущен на порту ${80}`);
})

// const url = "mongodb://127.0.0.1:27017/";
// // создаем объект MongoClient и передаем ему строку подключения
// const mongoClient = new MongoClient(url);

// mongoClient.connect().then(mongoClient => {
//     console.log('УРа1');
//     console.log(mongoClient.options.dbName); // получаем имя базы данных
// });

// console.log('УРа');
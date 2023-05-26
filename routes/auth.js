const config = require('../config');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');


const db = global.db

const tokenKey = crypto.randomBytes(50);
module.exports.tokenKey = tokenKey;


module.exports.signin = async (req, res) => {
    user = await db.collection("users").findOne({ login: req.body.login, password: req.body.password });

    if (!user)
        return res.status(404).json({ message: 'User not found' });

    if(user.imagepath)
    user.image = Array.from(fs.readFileSync(user.imagepath));

    return res.status(200).json({
        user: user,
        token: jwt.sign({ id: user._id.toString() }, module.exports.tokenKey),
    });

};

module.exports.signup = (req, res) => {
    console.log(req.body);

    user = req.body

    if (!user.login)
        return res.status(400).send('Login does not meet security requirements');

    if (!user.email)
        return res.status(400).send('Email required');

    if (!user.password)
        return res.status(400).send('Password does not meet security requirements');

    mailOptions = {
        from: 'lenyaplay@mail.ru',
        subject: 'Tellus',
        to: req.body.email,
        html: config.mail.activate_account_mail_template.replace('url', "https://google.com"),
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(400).send('Email is bad');
        }

        user.status = "not active";
        db.collection('users').insertOne(user);
        console.log('Email sent: ' + info.response);
        res.status(200);
        res.send(req.body);
    });
};


module.exports.jwtMiddleware = (req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            tokenKey,
            async (err, payload) => {
                if (!err && payload && payload.id)
                    req.user = await db.collection("users").findOne({ _id: ObjectId(payload.id) });
                next();
            }
        );
        return;
    }

    next();
};



module.exports.activate = async (req, res) => {
    console.log(req.url);

    user = await db.collection("users").findOneAndUpdate({ token: req.query.code }, { $set: { status: "active" } });

    if (!user)
        sendBadRequest("User is dont exist, or already activated");

    res.send("Account activated, enjoy using the app");
};
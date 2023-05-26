require ('dotenv').config();
const fs = require('fs');


const config = {}

config.mail = {}


config.mail.user = process.env.MAIL_USER || '';
config.mail.password = process.env.MAIL_PASSWORD || '';
config.mail.activate_account_mail_template = fs.readFileSync('C:\\Users\\LenyaPlay\\Desktop\\Projects\\tellus-server\\activate-account-mail-template.html').toString() || 'url';

// console.log(config);

config.file_storage = process.env.FILE_STORAGE || '';

config.admin = {}
config.admin.login = process.env.ADMIN_LOGIN;
config.admin.password = process.env.ADMIN_PASSWORD;
config.admin.email = process.env.ADMIN_EMAIL;


module.exports = config;
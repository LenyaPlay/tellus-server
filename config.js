const config = {}

config.mail = {}


config.mail.user = process.env.MAIL_USER || '';
config.mail.password = process.env.MAIL_PASSWORD || '';


module.exports = config;
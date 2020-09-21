var mongoose = require("mongoose")
var dbcn = require('../database/connect');

var userSchema = new mongoose.Schema({
    "email": String,
    "display_name": String,
    "password": String,
    "rule": String,
    "status": String,
    "token": String,
    "avatar": String,
    "api_key": String,
    "created": { type: Date, default: Date.now },
    "last_password_change": { type: Date, default: Date.now }
});


var user = mongoose.model('User', userSchema, 'users')
exports.Create = function(new_user) {
    new user({
        "email": new_user.email,
        "display_name": new_user.display_name,
        "password": new_user.password,
        "rule": new_user.rule,
        "status": new_user.status,
        "token": new_user.token,
        "api_key": new_user.api_key,
        "avatar": new_user.avatar
    }).save(function(err, doc) {
        if (err) console.log(err);
        else console.log("ss");

    });
}
exports.select = function() {
    return mongoose.model('User', userSchema, 'users');
}
var verifySchema = new mongoose.Schema({
    "email": String,
    "code": String,
    "ip": String,
    "created": { type: Date, default: Date.now },
    "status": { type: String, default: "not_verified" }
})
var verify_code = mongoose.model('verify_code', verifySchema, 'verify_code');

exports.verify_code = function() {
    return mongoose.model('verify_code', verifySchema, 'verify_code');
}
exports.create_verify_code = function(new_verify_code) {
    new verify_code({
        "email": new_verify_code.email,
        "code": new_verify_code.code,
        "ip": new_verify_code.ip
    }).save(function(err, doc) {
        if (err) console.log(err);

    });
}
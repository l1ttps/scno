var database = require('../database/connect');
var User = require("../database/model.users")

exports.check = function (req, res, next) {
    return new Promise(function (resolve, reject) {
        var token = req.cookies.access_token
        User.select().find({ token: token }).then(function (data) {
            if (!data[0]) {
                resolve(false)
            }
            else {
                resolve(true)
            }
        })
    });
}
var express = require('express')
var app = express();
var auth = express.Router();
var jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')
var md5 = require('md5');
var nodemailer = require('nodemailer')
var User = require("../database/model.users")
var moment = require('moment')
auth.use(bodyParser.urlencoded({ extended: false }))
var mongoose = require("mongoose")
var sha256 = require('sha256');


// parse application/json
auth.use(bodyParser.json())

auth.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    password = md5(password);
    User.select().find({ email: email, password: password }).then(function(data) {
        if (data[0]) {
            res.status(200)
                .cookie('access_token', data[0].token, {
                    expires: new Date(Date.now() + 48 * 3600000),
                    httpOnly: true
                }).cookie('api_key', data[0].api_key, {
                    expires: new Date(Date.now() + 48 * 3600000),
                    httpOnly: false
                })
                .json({
                    display_name: data[0].display_name,
                    token: data[0].token,
                    avatar: data[0].avatar
                })
        } else res.status(401).json({
            message: "Username or password incorrect"
        })
    })
})
auth.post('/signup', function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var display_name = req.body.display_name;
        var random_number = create_random_number(100000, 999999)
        var new_verify_code = {
            "email": email,
            "code": random_number,
            "ip": req.ip
        }

        check_email_exist(email).then(function(check_email) {
            if (check_email == true) {
                res.status(403).json({
                    message: "This e-mail is already taken"
                })
            } else { // email not exist
                check_request_verify_code(email).then(function(check) {
                    if (check == true) {
                        send_mail(email, random_number);
                        clear_verify_code_old(email); //clear verify code old
                        User.create_verify_code(new_verify_code); // add 1 verify code to database
                        res.status(200).json({
                            message: "Success"
                        })
                    } else {
                        res.status(500).json({
                            message: "Too many requests, try again later"
                        })
                    }
                });
            }
        })

    }) // post singnup


function create_token(document, private_key) {
    var token = jwt.sign(document, private_key);
    return token;
}


auth.post('/verify_code', function(req, res) {
    //////// Request Body
    var email = req.body.email;
    var verify_code = req.body.verify_code;
    var password = req.body.password;
    var display_name = req.body.display_name;
    var ip = req.ip;

    /////// Verify Code / Response
    User.verify_code().find({ email: email, code: verify_code }).then(function(data) {
        if (data[0]) {
            check_request_verify_code(email).then(function(check) {
                if (check == false) {

                    //// Create Token
                    key = md5(email);
                    var document = {
                        "key": key
                    }
                    var private_key = md5(password);
                    var token = create_token(document, private_key);
                    var datetime = new Date();
                    var api_key = sha256(token + datetime);
                    console.log(token + datetime);
                    /////// Create Data User
                    var new_user = {
                        "email": email,
                        "display_name": display_name,
                        "password": md5(password),
                        "rule": "none",
                        "avatar": "avatar-default.png",
                        "status": 1,
                        "token": token,
                        "api_key": api_key
                    }
                    check_email_exist(email).then(function(check_email) {
                        if (check_email == true) {
                            res.status(500).json({
                                message: "Too many requests"
                            });
                        } else {
                            User.Create(new_user) // insert new user to database//
                            res.status(200).cookie('access_token', token, {
                                expires: new Date(Date.now() + 48 * 3600000),
                                httpOnly: true
                            }).json({
                                message: "Success"
                            });
                        }
                    })
                } else {
                    res.status(403).json({
                        message: "Verification code has expired."
                    });
                }
            });
        } else {
            res.status(401).json({
                message: "The verification code is incorrect."
            });
        }
    })
})

auth.post("/delete_verify_code", function(req, res) {
    var email = req.body.email;
    var ip_address = req.ip;

    User.verify_code().deleteMany({ email: email, ip: ip_address }).then(function(callback) {
        if (callback.deletedCount == 0) {

            res.status(501).json({
                message: "An error occurred while clearing the verify code"
            });
        } else {
            res.status(200).json({
                message: "Success"
            });
        }
    });
});

async function send_mail(email, number_code) {


    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASSWORD_MAIL
        }
    });
    let info = await transporter.sendMail({
        from: '"Scan Network Online" <' + process.env.MAIL + '>',
        to: email,
        subject: 'Create a Scan Network Online account',
        text: 'Test',
        html: '<b>Your verification code is: ' + number_code + '</b>'
    });
}

function create_random_number(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function check_request_verify_code(email) {
    return new Promise(function(resolve, reject) {
        User.verify_code().findOne({ email: email }).sort({ created: -1 }).then(function(data) {
            if (data) {
                var date_created = moment(data.created).format('YYYY-MM-DD HH:mm:ss');
                if (moment().diff(date_created, 'minutes') < 2) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            } else {
                resolve(true);
            }
        });
    });
}

function clear_verify_code_old(email) {
    User.verify_code().deleteMany({ email: email }).then(function(err) {
        if (err) console.log(err);
    });
}

function check_email_exist(email) {
    return new Promise(function(resolve, reject) {
        User.select().find({ email: email }).then(function(data) {
            if (data[0]) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}
module.exports = auth
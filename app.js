var express = require('express')
var app = express()
var port = process.env.PORT || 8080;
app.use(express.static('public'))
var database = require('./database/connect');
var User = require("./database/model.users")
require('dotenv').config({ path: __dirname + '/.env' });
var axios = require('axios')
app.set('view engine', 'ejs');
var cookieParser = require("cookie-parser")
app.use(cookieParser())
var moment = require('moment')


var status_login = require('./midleware/status_login')
app.get("/", function(req, res) {
    res.render(__dirname + '/views/home_not_login.ejs')
    // status_login.check(req, res).then(function(data) {
    //     if (data == true) {
    //         var access_token = req.cookies.access_token;
    //         User.select().findOne({ token: access_token }).then(function(data) {
    //             res.render(__dirname + '/views/home_loged.ejs', {
    //                 display_name: data.display_name.toUpperCase()
    //             })
    //         })

    //     } else 
    // })
})

app.get("/login", function(req, res) {
    status_login.check(req, res).then(function(data) {
        if (data == true) res.redirect('/');
        else res.render(__dirname + '/views/login.ejs')
    })
})


app.get("/logout", function(req, res) {
    res.status(200).cookie('access_token', 'null', {
            expires: new Date(Date.now() - 1),
            httpOnly: true
        }).cookie('api_key', 'null', {
            expires: new Date(Date.now() - 1),
            httpOnly: true
        })
        .redirect('/')
})



app.get("/signup", function(req, res) {
    status_login.check(req, res).then(function(data) {
        if (data == true) res.redirect('/');
        else res.render(__dirname + '/views/signup.ejs')
    })
})

app.get("/scan-network", function(req, res) {
    res.redirect('/login#scan-network');
    // status_login.check(req, res).then(function(data) {
    //     if (data == true) {
    //         var access_token = req.cookies.access_token;
    //         User.select().findOne({ token: access_token }).then(function(data) {
    //             res.render(__dirname + '/views/scan.ejs', {
    //                 display_name: data.display_name.toUpperCase()
    //             })
    //         })
    //     } else 
    // })

})

app.get("/pentest-website", function(req, res) {
    status_login.check(req, res).then(function(data) {
        if (data == true) {
            var access_token = req.cookies.access_token;
            User.select().findOne({ token: access_token }).then(function(data) {
                res.render(__dirname + '/views/pentest-website.ejs', {
                    display_name: data.display_name.toUpperCase()
                })
            })
        } else res.redirect('/login#pentest-website');
    })

})


app.get("/get-api-key", function(req, res) {

    status_login.check(req, res).then(function(data) {
        if (data == true) {
            var access_token = req.cookies.access_token;
            User.select().findOne({ token: access_token }).then(function(data) {
                res.render(__dirname + '/views/get-api-key.ejs', {
                    api_key: data.api_key,
                    display_name: data.display_name.toUpperCase()
                })
            })

        } else res.redirect('/login');
    })

})


app.get("/setting", function(req, res) {

    status_login.check(req, res).then(function(data) {
        if (data == true) {
            var access_token = req.cookies.access_token;
            User.select().findOne({ token: access_token }).then(function(data) {
                var last_password_change = moment(data.last_password_change).format('YYYY-MM-DD');
                res.render(__dirname + '/views/setting.ejs', {
                    display_name: data.display_name.toUpperCase(),
                    email: data.email,
                    last_password_change: last_password_change
                })
            })

        } else res.redirect('/login#setting');
    })
})


app.get("/test", function(req, res) {
    var spawnSync = require('child_process').spawnSync;
    // -oX - -T4 -A -v epu.edu.vn
    var result = spawnSync('nmap', ['-oX', '-', '-T4', '-A', '-v', 'genk.vn']);
    var savedOutput = result.stdout;

    var convert = require('xml-js');
    var json = convert.xml2json(savedOutput, { compact: true, spaces: 4 });

    console.log(String(json));
    res.end(json);
})
app.get("/machine-learning", function(req, res) {
    res.render(__dirname + '/views/machine-learning.ejs')
})

app.get("/json", function(req, res) {
    const fs = require('fs');
    let rawdata = fs.readFileSync('data.json');
    let student = JSON.parse(rawdata);
    res.json(student.nmaprun);
})
var api = require("./api/api.js")
app.use('/api', api)

var auth = require('./account/auth')
app.use('/auth', auth)

app.get("*", function(req, res) {
    // status_login.check(req, res).then(function(data) {
    //     if (data == true) {
    //         var access_token = req.cookies.access_token;
    //         User.select().findOne({ token: access_token }).then(function(data) {
    //             res.render(__dirname + '/views/404.ejs', {
    //                 display_name: data.display_name.toUpperCase()
    //             })
    //         })

    //     } else res.render(__dirname + '/views/home_not_login.ejs')
    // })
    res.redirect("/")
})
app.listen(port, function() {
    console.log("server running port " + port)
})
var express = require('express');
var api = express.Router();
var axios = require('axios')
var bodyParser = require('body-parser')
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: false }))
var User = require("../database/model.users")
var random_id_spider = 8062753941;
var random_id_ascan = 0;
////////////////////
api.get("", function(req, res) {
        res.redirect('../')
    })
    ////////////////////  GET IP INFO    ////////////////////
var data_ip = {

    "status": "success",
    "country": "Vietnam",
    "countryCode": "VN",
    "region": "HN",
    "regionName": "Hanoi",
    "city": "Hanoi",
    "zip": "",
    "lat": 21.0278,
    "lon": 105.834,
    "timezone": "Asia/Ho_Chi_Minh",
    "isp": "VNPT Corp",
    "org": "Vasc",
    "as": "AS7643 Vietnam Posts and Telecommunications (VNPT)",
    "query": "203.162.69.68"
}

api.get("/ip/:target", function(req, res) {
    var target = req.params.target;
    axios.get('http://ip-api.com/json/' + target)
        .then(function(response) {
            res.status(200).json(response.data)
        })

})


////////////////////  NMAP SCAN    ///////////////////
var nmap = require("../scan-tools/nmap/nmap.js")
api.get("/scan-network/:target", function(req, res) {
        var target = req.params.target;
        axios.get('http://ip-api.com/json/' + target)

        .then(function(response) {
            if (response.data.status == 'fail') {
                res.status(404).json(response.data);
            } else {
                nmap.scan(target).then(function(data) {
                        res.json(data)
                    })
                    // res.json(nmap.scan(target));
            }
        })
    })
    ////////////////////  ZAP API    ///////////////////
var ScanTool = require('../database/model.scan_tools');

var zap = require('../scan-tools/pentest_website/zap.js')


api.get("/pentest-website/status", function(req, res) {
    zap.CheckRunning().then(function(response) {
        var status = response.status
        if (status) {
            res.json({
                message: "Running"
            })
        } else {
            res.json({
                message: "Not Running"
            })
        }
    })
})
api.post("/pentest-website/spider/", function(req, res) {
    var target = req.body.url;
    var api_key = req.body.api_key
    if (target == '' || !target) {
        res.json({
            message: 'Url invalid'
        })
    } else {
        check_api_key(api_key).then(function(check_status) {
            if (check_status == true) {
                zap.spider(target).then(function(response) {

                    if (!response.data) {
                        res.json({
                            message: 'Url invalid'
                        })
                    } else {
                        var new_pentest_tool = {
                            api_key: api_key,
                            id_spider: parseInt(response.data.scan) + random_id_spider,
                            url: target
                        }
                        ScanTool.createPentestTool(new_pentest_tool);
                        res.json({
                            id: parseInt(response.data.scan) + random_id_spider
                        })
                    }
                })
            } else {
                res.status(401).json({
                    message: "API Key Invalid."
                })
            }
        })
    }
})
api.get("/pentest-website/spider/status", function(req, res) {
    var scanId = req.query.scanId - random_id_spider;
    var rootScanId = req.query.scanId;
    var api_key = req.query.api_key
    check_api_key(api_key).then(function(check_status) {
        if (check_status == true) {
            zap.SpiderStatus(scanId).then(function(response) {
                var data = response.data
                if (data) {
                    if (data.status == 100) {
                        var id;
                        ScanTool.PentestTool().findOne({ id_spider: rootScanId }).then(function(data) {
                            zap.Ascan(data.url).then(function(response) {
                                id = response.data.scan;
                                res.json({
                                    status: '100',
                                    active_scan: id
                                })
                                ScanTool.PentestTool().findOneAndUpdate({ id_spider: rootScanId }, { id_ascan: response.data.scan })
                                    .then(function() {
                                        console.log("ss id")
                                    })

                            })
                        })

                    } else {
                        res.json({
                            status: data.status,

                        })
                    }
                } else {
                    res.status(400).json({
                        message: "ScanId Does Not Exist"
                    })
                }
            })
        } else {
            res.status(401).json({
                message: "API Key Invalid"
            })
        }
    })
})
api.post('/pentest-website/spider/resuit', function(req, res) {
    var scan_id = req.body.scan_id;
    var api_key = req.body.api_key;
    check_api_key(api_key).then(function(check_status) {
        if (check_status == true) {
            zap.SpiderResuit(scan_id - random_id_spider).then(function(response) {
                var data = response.data;
                if (data) {
                    res.json(data)
                } else {
                    res.json({
                        message: "Scan ID Not Exist"
                    })
                }
            })
        } else {
            res.status(401).json({
                message: "API Key Invalid"
            })
        }
    })
})

api.post("/pentest-website/active-scan/status", function(req, res) {
    var id = req.body.id;
    var api_key = req.body.api_key;
    check_api_key(api_key).then(function(check_status) {
        if (check_status == true) {
            zap.AscanStatus(id).then(function(response) {
                var data = response.data;
                if (data) {
                    res.json({
                        status: data.status
                    })
                } else {
                    res.json({
                        message: "Id Invalid"
                    })
                }
            })
        } else {
            res.status(401).json({
                message: "API Key Invalid"
            })
        }
    })
})

function check_api_key(api_key) {
    return new Promise(function(resolve, reject) {
        User.select().findOne({ api_key: api_key }).then(function(data) {
            if (data) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}
module.exports = api;
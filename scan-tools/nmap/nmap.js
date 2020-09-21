var nmap = require('node-nmap');
var user = require('../../database/model.users');

var data = [{ "hostname": "epu.edu.vn", "ip": "203.162.69.68", "mac": null, "openPorts": [{ "port": 21, "protocol": "tcp", "service": "ftp", "method": "table" }, { "port": 25, "protocol": "tcp", "service": "smtp", "method": "table" }, { "port": 53, "protocol": "tcp", "service": "domain", "method": "table" }, { "port": 80, "protocol": "tcp", "service": "http", "method": "table" }, { "port": 110, "protocol": "tcp", "service": "pop3", "method": "table" }, { "port": 135, "protocol": "tcp", "service": "msrpc", "method": "table" }, { "port": 143, "protocol": "tcp", "service": "imap", "method": "table" }, { "port": 443, "protocol": "tcp", "service": "https", "method": "table" }, { "port": 1433, "protocol": "tcp", "service": "ms-sql-s", "method": "table" }, { "port": 3389, "protocol": "tcp", "service": "ms-wbt-server", "method": "table" }, { "port": 49154, "protocol": "tcp", "service": "unknown", "method": "table" }, { "port": 49155, "protocol": "tcp", "service": "unknown", "method": "table" }, { "port": 49156, "protocol": "tcp", "service": "unknown", "method": "table" }], "osNmap": "Microsoft Windows Server 2008 R2 SP1" }]

exports.scan = function scan(target) {
    return new Promise(function(resolve, reject) {
        var nmapscan = new nmap.NmapScan(target, '-T4 -A -v');
        nmapscan.on('complete', function(scan) {
            console.log("----------------");
            console.log(scan);
            resolve(scan)
        });
    });
    // var nmapscan = new nmap.NmapScan(target, '-T4 -A -v');
    // nmapscan.on('complete', function(scan) {
    //     console.log("----------------");
    //     console.log(scan);
    // });

    // return data;
}
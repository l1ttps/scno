var mongoose = require("mongoose")
var dbcn = require('../database/connect');

var PentestSchema = new mongoose.Schema({
    api_key: String,
    id_spider: String,
    url: String,
    active_scan: { type: String, default: 'inactive' },
    id_ascan: { type: String, default: 'unknown' },
    date: { type: Date, default: Date.now },
})
var pentest_tool = mongoose.model('Pentest_tools', PentestSchema, 'pentest_tool');

exports.createPentestTool = function(new_pentest_tool) {
    new pentest_tool({
        'api_key': new_pentest_tool.api_key,
        'id_spider': new_pentest_tool.id_spider,
        'url': new_pentest_tool.url
    }).save();
}
exports.PentestTool = function() {
    return mongoose.model('Pentest_tools', PentestSchema, 'pentest_tool');
}
var mongoose = require("mongoose");
var connect_string = 'mongodb+srv://l1ttps:hlHzjwHLz0zbxowf@cluster0-yd0v9.gcp.mongodb.net/test?retryWrites=true&w=majority';
var connect_string_local = 'mongodb://0.0.0.0:27017/scno'
mongoose
    .connect(connect_string, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err);
    });

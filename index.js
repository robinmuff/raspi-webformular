var port = 80;

var express = require('express');
const fs = require('fs');
const { exec } = require("child_process");
var app = express();

const options = {
    root: __dirname,
    dotfiles: 'deny'
};

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

app.use(express.static('static'));

app.get("/", function(req, res) {
    res.sendFile("/static/sites/index.html", options)
});
app.post("/items/del", function(req, res) {
    let rawdata = fs.readFileSync('static/data/information.json');
    let infos = JSON.parse(rawdata);
    let newinfos = [];

    for (var i = 0; i < infos.length; i++) {
        if (infos[i].website != req.body.websitename) {
            newinfos.push(infos[i]);
        }
    }

    fs.writeFileSync('static/data/information.json', JSON.stringify(newinfos));

    res.redirect("/")
});
app.post("/items/add", function(req, res) {
    let rawdata = fs.readFileSync('static/data/information.json');
    let infos = JSON.parse(rawdata);

    infos.push({ "name": req.body.name, "kuerzel": req.body.kuerzel, "website": req.body.website })

    fs.writeFileSync('static/data/information.json', JSON.stringify(infos));

    res.redirect("/")
});
app.post("/server/restart", function(req, res) {
    exec('/sbin/shutdown -r now');
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});
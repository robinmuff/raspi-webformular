require('dotenv').config()
var express = require('express');
const fs = require('fs');
const { exec } = require("child_process");
var app = express();

var port = process.env.port || 81;

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
    res.sendFile(process.env.indexFile, options)
});
app.post("/items/del", function(req, res) {
    let rawdata = fs.readFileSync(process.env.infoFile);
    let infos = JSON.parse(rawdata);
    let newinfos = [];

    for (var i = 0; i < infos.length; i++) {
        if (infos[i].website != req.body.websitename) {
            newinfos.push(infos[i]);
        }
    }

    fs.writeFileSync(process.env.infoFile, JSON.stringify(newinfos));

    updateTextFiles();

    res.redirect("/")
});
app.post("/items/add", function(req, res) {
    let rawdata = fs.readFileSync(process.env.infoFile);
    let infos = JSON.parse(rawdata);

    infos.push({ "name": req.body.name, "kuerzel": req.body.kuerzel, "website": req.body.website })

    fs.writeFileSync(process.env.infoFile, JSON.stringify(infos));

    updateTextFiles();

    res.redirect("/")
});
app.post("/server/restart", function(req, res) {
    exec(process.env.restartCommand);
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

function updateTextFiles() {
    let rawdata = fs.readFileSync(process.env.infoFile);
    let infos = JSON.parse(rawdata);
    let csvtext = "";
    let txttext = "";

    for (var i = 0; i < infos.length; i++) {
        csvtext += "\"" + infos[i].name + "\"," + infos[i].kuerzel + "," + infos[i].website + "\n";
        txttext += infos[i].website + "\n";
    }

    fs.writeFileSync(process.env.exportCSVfile, csvtext);
    fs.writeFileSync(process.env.exportTXTfile, txttext);
}
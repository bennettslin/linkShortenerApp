var db = require('./models');

var Hashids = require("hashids");
var salt = "This is Bennett's salt.";
var hashids = new Hashids(salt);

var express = require('express');
var linksCtrl = require('./controllers/links');
var bodyParser = require('body-parser');
var app = express();

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use("/links", linksCtrl);

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/:hash", function(req, res) {
  var link_id = parseInt(hashids.decode(req.params.hash));
  db.link.find(link_id).then(function(accessedLink) {
    accessedLink.count = accessedLink.count + 1;
    accessedLink.save();
    res.redirect(req.headers.host + '/' + accessedLink.url);
  }).catch(function(error) {
    console.log(error);
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000.");
});

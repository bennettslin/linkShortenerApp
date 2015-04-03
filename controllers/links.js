var db = require('../models');

var Hashids = require("hashids");
var salt = "This is Bennett's salt.";
var hashids = new Hashids(salt);

var express = require('express');
var router = express.Router();

router.get("/", function(req, res) {
  db.link.findAll().then(function(links) {
    var linkArray = links.map(function(link) {
      return {url: link.url, hash: link.hash, count: link.count};
    });

  linkArray.sort(function(a, b) {
    if (a.count < b.count) {
      return 1;
    } else if (a.count > b.count) {
      return -1;
    } else {
      return 0;
    }
  });

    var locals = {links: linkArray};
    res.render("links/index", locals);
  })
});

router.post("/", function(req, res) {
  db.link.create({url:req.body.url}).then(function(createdLink) {
    var hash = hashids.encode(createdLink.id);
    createdLink.hash = req.headers.host + '/' + hash;
    createdLink.count = 0;
    createdLink.save();
    res.render("links/show", {hash:hash, count:createdLink.count, host:req.headers.host});
  }).catch(function(error) {
    console.log(error);
  });
});

router.get("/:id", function(req, res) {
  var link_id = parseInt(hashids.decode(req.params.id));
  db.link.find(link_id).then(function(link) {
    res.render("links/show", {hash:req.params.id, count:link.count, host:""});
  });
});

module.exports = router;
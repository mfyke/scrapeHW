var express = require("express");
var router = express.Router();

var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var path = require("path");


mongoose.Promise = Promise;

router.get("/", function(req, res) {
  res.render('index');
});

router.get("/scrape", function(req, res) {
  Article.find({}, function(error, docs) {
    request("https://www.reddit.com", function(error, response, html) {
      var $ = cheerio.load(html);
      $("p.title").each(function(i, element) {
        var result = {};
        result.title = $(this).text();
        result.link = $(this).children().attr("href");
        var checkDupe = false;
        for(var i = 0; i < docs.length; i++) {
          if(docs[i].title === result.title) {
            checkDupe = true;
          }
        }
        if(checkDupe) {
          console.log("Nope.gif");
        } else {
          var entry = new Article(result);
          entry.save(function(err, doc) {
            if (err) {
              console.log(err);
            }
            else {
              console.log(doc);
            }
          });          
        }
      });
      res.redirect("/");
    });    
  })
});

router.get("/articles", function(req, res) {
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

router.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("note")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

router.post("/articles/:id", function(req, res) {
  var newNote = new Note(req.body);

  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});


module.exports = router;
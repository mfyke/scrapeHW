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
  var note = {};
  note.title = req.body.title;
  note.body = req.body.body;
  note.articleId = req.body.articleId;
  var newNote = new Note(note);

  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      console.log(doc);
      res.redirect("/");
    }
  });
});

router.get("/notes/:articleId", function(req, res) {
  Note.find({ articleId: req.params.articleId }).exec(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc);
      res.render("partials/notes", {notes: doc, articleId: req.params.articleId});
    }
  });
});

router.delete("/delete-note/:id", function(req, res) {
  Note.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Deleted note from the database");
      res.send("Deleted note from the database");
    }
  })
});


module.exports = router;
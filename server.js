

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var path = require("path");
var router = express.Router();
var controller = require("./controller");
mongoose.Promise = Promise;


// Initialize Express
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(process.cwd() + "/public"));
// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir


// Database configuration with mongoose
mongoose.connect("mongodb://localhost/scrapeHW");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.use("/", controller);
// Routes
// ======

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  Article.find({}, function(error, docs) {
    request("https://www.reddit.com/r/buildapcsales", function(error, response, html) {
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

// app.get("/", function (req, res) {
//   res.render("index");
// });
// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});


// Listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port 3000!");
});

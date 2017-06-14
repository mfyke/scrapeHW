var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var path = require("path");
var router = express.Router();
var controller = require("./controller");
mongoose.Promise = Promise;

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(process.cwd() + "/public"));

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect("mongodb://heroku_v3m0qpjx:8dk08p0atcrc1jd3s9ch43ud54@ds117592.mlab.com:17592/heroku_v3m0qpjx");
// mongoose.connect("mongodb://localhost/redditscrapedb");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.use("/", controller);

app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port 3000!");
});

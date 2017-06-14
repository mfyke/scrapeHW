# scrapeHW

## Instructions

* Create an app that follows this user story:

  1. Whenever a user visits your site, the app will scrape stories from a news outlet of your choice. The data should at least include a link to the story and a headline, but feel free to add more content to your database (photos, bylines, and so on).
  2. Use Cheerio to grab the site content and Mongoose to save it to your MongoDB database. 

  3. All users can leave comments on the stories you collect. They should also be allowed to delete whatever comments they want removed. All stored comments should be visible to every user.
  4. You'll need to use Mongoose's model system to associate comments with particular articles. 

### Tips

* Go back to Saturday's activities if you need a refresher on how to partner one model with another.

* Whenever you scrape a site for stories, make sure an article isn't already represented in your database before saving it; we don't want duplicates. 

* Don't just clear out your database and populate it with scraped articles whenever a user accesses your site. 
  * If your app deletes stories every time someone visits, your users won't be able to see any comments except the ones that they post.
### Technologies

1. express
2. express-handlebars
3. mongoose
4. body-parser
5. cheerio
6. request

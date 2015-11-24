/**
 * LICENSE
 *
 Copyright 2015 Grégory Saive (greg@evias.be)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 *
 * @package PicPoll
 * @subpackage Frontend
 * @author Grégory Saive <greg@evias.be>
 * @license http://www.apache.org/licenses/LICENSE-2.0
 * @link https://picpoll.parseapp.com
**/

models  = require("cloud/models.js");
core    = require("cloud/core.js");
crypto  = require('crypto');
express = require('express');
app = express();

app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({
  name: "PicPoll",
  keys: [
    "b36dd388574e6e66a9eb092af935a1cc55376516",
    "dc6482271a7885f2ca05efb2b7705d45987da7f2",
    "f969f2daa67d789e6fc8a7f2731806463b97ce2b",
    "e486a6910d1d6ce2574958ab97e9a0f50b5c1bfa",
    "82d6f71e26f644c26a66e9eb7458eb5071ab942e"
  ],
  secret: "60eb6e62c777d5e926880592c976abe6d8cc0937"}));

/*******************************************************************************
 * PRE-HTTP requests handlers for PicPoll
 * These functions act as Plugins to the HTTP handlers.
 * @link https://picpoll.parseapp.com
 *******************************************************************************/

/**
 * Session management PRE-HTTP request handler.
 * This function will try to retrieve a valid session token
 * and call Parse.User.become() with it in order for Parse.User
 * method current() returns the correct request initiating user
 * object.
 **/
app.use(function(req, res, next)
{
  Parse.User
    .become(req.session.sessionToken ? req.session.sessionToken : "invalidSessionToken")
    .then(
      function(currentUser) {
        // currentUser now contains the BROWSER's logged in user.
        // Parse.User.current() for `req` will return the browsers user as well.

        next();
      },
      function(error) {
        // not logged in => will result in redirection to /signin
        next();
      });
});

/**
 * Fill default local request variables.
 * This method fills the variables :
 * - currentUser   : Parse.User instance of boolean false
 * - currentMonth  : date String in format "mmYYYY"
 **/
app.use(function(req, res, next)
{
  var currentUser = Parse.User.current();
  if (! currentUser)
    currentUser = false;

  var ipAddress = req.connection.remoteAddress;
  var userAgent = req.headers['user-agent'];
  var userHash  = crypto.createHash("sha1")
                        .update(userAgent + "@" + ipAddress)
                        .digest("hex");

  res.locals.currentUser  = currentUser;
  res.locals.currentMonth = core.Month.getCurrentMonth();
  res.locals.userHash     = userHash;
  next();
});

/*******************************************************************************
 * HTTP GET requests handlers for PicPoll
 * @link https://picpoll.parseapp.com
 *******************************************************************************/

/**
 * GET /
 * describes the homepage GET request.
 * this handler will render the authentication
 * template if no session is available or render
 * the homepage template for logged users.
 **/
app.get('/', function(request, response)
{
  var error   = request.query.error;
  var success = request.query.success;

  var ipAddress = request.connection.remoteAddress;
  var userAgent = request.headers['user-agent'];

  var dtObject  = new Date();
  var dateStr   = dtObject.getTime();
  var hashStr   = userAgent + "@" + ipAddress + " (" + dateStr + ")";

  // create SHA-1 hash for unique PicPoll Swiper
  var uniqueId  = crypto.createHash("sha1")
                        .update(hashStr).digest("hex");

  // load Picture entries
  Parse.Cloud.run("listPictures", {}, {
    success: function (cloudResponse)
    {
      response.render('homepage', {
        "month": cloudResponse.month,
        "pictures": cloudResponse.pictures,
        "uniqueId": uniqueId,
        "errorMessage": error ? unescape(error) : false,
        "successMessage": success ? unescape(success) : false
      });
    },
    error: function (cloudResponse)
    {
      response.send("Error: " + cloudResponse.message);
    }
  });
});

/**
 * GET /signin
 * describes the signin GET request.
 * this handler will render the login view.
 **/
app.get('/signin', function(request, response)
{
  var currentUser = Parse.User.current();
  if (currentUser)
    response.redirect("/");
  else
    response.render('login', {
      "errorMessage": false});
});

/**
 * GET /signup
 * describes the signup GET request.
 * this handler will render the signup view.
 **/
app.get('/signup', function(request, response)
{
  var currentUser = Parse.User.current();
  if (currentUser)
    response.redirect("/");
  else {
    var formValues = {
      "username": "",
      "email": "",
    };
    response.render('signup', {
      "formValues": formValues,
      "errorMessage": false});
  }
});

/**
 * GET /signout
 * describes the signout GET request.
 * this handler will redirect to the /signin
 **/
app.get('/signout', function(request, response)
{
  Parse.User.logOut();
  request.session = null;

  response.redirect("/signin");
});

/**
 * GET /terms-and-conditions
 * describes the terms & conditions GET request.
 * this handler will render the terms view.
 **/
app.get('/terms-and-conditions', function(request, response)
{
  response.render('terms', {});
});

/**
 * GET /getStatistics
 * describes the getStatistics GET request.
 * this handler will send a JSON response.
 **/
app.get('/getStatistics', function(request, response)
{
  // load Picture entries
  Parse.Cloud.run("getStatistics", {}, {
    success: function (cloudResponse)
    {
      response.status(200)
              .send({
                "result": true,
                "series": cloudResponse.series,
                "categories": cloudResponse.categories});
    },
    error: function (cloudResponse)
    {
      response.status(200)
              .send("Error: " + cloudResponse.message);
    }
  });
});

/*******************************************************************************
 * HTTP POST requests handlers for PicPoll
 * @link https://picpoll.parseapp.com
 *******************************************************************************/

/**
 * POST /signin
 * describes the signin POST request.
 * this handler is where we authenticate
 * a Parse.User session using the provided
 * signin form data.
 **/
app.post('/signin', function(request, response)
{
  var username = request.body.username;
  var password = request.body.password;

  currentUser  = Parse.User.logIn(username, password, {
    success: function(currentUser) {
      // user authentication credentials are OK, we can
      // now safely save the session token for this user
      // and finally redirect to the homepage.

      request.session.loggedState  = true;
      request.session.sessionToken = currentUser.getSessionToken();

      response.redirect("/");
    },
    error: function(currentUser, error) {
      request.session = null;

      response.render('login', {
        "errorMessage": error.message});
    }
  });
});

/**
 * POST /signup
 * describes the signup POST request.
 * this handler is where we register new
 * Parse.User entries.
 **/
app.post('/signup', function(request, response)
{
  var username = request.body.username;
  var email    = request.body.username;
  var password = request.body.password;
  var pwconfirm = request.body.pwconfirm;

  var formValues = {
    "username": username,
    "email": email
  };

  errors = [];
  if (!email || !email.length || !username || !username.length)
    errors.push("The Email adress may not be empty.");

  if (!password || !password.length)
    errors.push("The Password may not be empty.");

  if (password != pwconfirm)
    errors.push("The Passwords do not match !");

  if (errors.length)
  // refresh with error messages displayed
    response.render("signup", {
      "formValues": formValues,
      "errorMessage": errors.join(" ", errors)});
  else {
  // sign-up user !
    var currentUser = new Parse.User();
    currentUser.set("username", username);
    currentUser.set("email", email);
    currentUser.set("password", password);

    currentUser.signUp(null, {
    success: function(currentUser) {
      // user registration was successfully done
      // we can now safely save the session token
      // and redirect the user to the homepage

      request.session.loggedState  = true;
      request.session.sessionToken = currentUser.getSessionToken();
      response.redirect("/");
    },
    error: function(currentUser, error) {
      request.session = null;

      response.render('signup', {
        "formValues": formValues,
        "errorMessage": error.message});
    }});
  }
});

/**
 * POST /saveVote
 * describes the saveVote POST request.
 * this handler is where we save the session
 * vote for the given picture.
 **/
app.post("/saveVote", function(request, response)
{
  var pictureId = request.body.voting;
  var ipAddress = request.connection.remoteAddress;
  var userAgent = request.headers['user-agent'];

  var dtObject  = new Date();
  var dateStr   = dtObject.getDate()
                + dtObject.getMonth()
                + dtObject.getFullYear();
  var hashStr   = userAgent + "@" + ipAddress + " (" + dateStr + ")";

  // create SHA-1 hash for voting user
  var userHash  = crypto.createHash("sha1")
                        .update(hashStr).digest("hex");

  Parse.Cloud.run("saveVote", {
    "pictureId": pictureId,
    "userHash": userHash
  }, {
    success: function (cloudResponse) {
      response.send({"result": true});
    },
    error: function (cloudResponse) {
      response.send({"result": false, "error": cloudResponse.message});
    }
  });
});

// Attach the Express app to Cloud Code.
app.listen();

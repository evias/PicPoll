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
 * @subpackage CloudCode
 * @author Grégory Saive <greg@evias.be>
 * @license http://www.apache.org/licenses/LICENSE-2.0
 * @link https://picpoll.parseapp.com
**/
models = require('cloud/models.js');
core   = require('cloud/core.js');

require('cloud/app.js');

/*******************************************************************************
 * Parse CloudCode Functions definition for PicPoll
 * @link https://picpoll.parseapp.com
 *******************************************************************************/

/**
 * The ping Parse CloudCode Functions simply responses with
 * a "pong" message and a timestamp.
 * This Function can be used to check the API availability.
 **/
Parse.Cloud.define("ping", function(request, response)
{
  response.success({ping: "pong", timestamp: new Date()});
});

/**
 * The listPictures Parse CloudCode Functions responses
 * with a JSON response containing a 'pictures' array of pictures.
 **/
Parse.Cloud.define("listPictures", function(request, response)
{
  var month = "undefined" == typeof request.params.month ?
            core.Month.getCurrentMonth() : request.params.month;

  var pictures = new Parse.Query(models.Picture)
  pictures.equalTo("month", month);
  pictures.ascending("countVotes");
  pictures.find({
    success: function(pictures)
    {
      if (! pictures)
        pictures = [];

      response.success({
        "result": true,
        "month": month,
        "pictures": pictures
      });
    }
  });
});

/**
 * The saveVote Parse CloudCode Functions responses
 * with a JSON response containing a 'result' boolean
 * and a 'vote' object in case of a valid save action.
 **/
Parse.Cloud.define("saveVote", function(request, response)
{
  var pictureId  = request.params.pictureId;
  var userHash   = request.params.userHash;

  // load Picture pointer, then insert
  // a new Vote entry.
  var thePicture = new Parse.Query(models.Picture);
  thePicture.get(pictureId, {
  success: function(thePicture) {

    // save new vote for picture
    var cntVotes = thePicture.get("countVotes") + 1;
    thePicture.set("countVotes", cntVotes);
    thePicture.save(null, {
    success: function(thePicture) {
      var theVote = new models.Vote();
      theVote.set("picture", thePicture);
      theVote.set("userHash", userHash);
      theVote.save(null, {
      success: function(theVote) {
        response.success({
          "result": true,
          "vote": theVote});
      },
      error: function(error) { response.error(error.message); }
      });
    }});
  },
  error: function(error) { response.error(error.message); }
  });
});

/**
 * The getStatistics Parse CloudCode Functions responses
 * with a JSON response containing a 'series' array of pictures
 * with their name and count of votes, and 'categories' array
 * representing the statistics plots (columns - X axis).
 **/
Parse.Cloud.define("getStatistics", function(request, response)
{
  var month = "undefined" == typeof request.params.month ?
            core.Month.getCurrentMonth() : request.params.month;

  // get pictures and filter by current month
  var pictures = new Parse.Query(models.Picture)
  pictures.equalTo("month", month);
  pictures.descending("createdAt");
  pictures.find({
    success: function(pictures)
    {
      if (! pictures)
        pictures = [];

      // count votes and return series according to
      // Highcharts input data.
      // @link http://api.highcharts.com/highcharts
      var series     = [];
      var categories = [];
      for (var i = 0; i < pictures.length; i++) {
        pic = pictures[i];

        categories.push(pic.get("title"));
        series.push({
          "name": pic.get("title"),
          "data": [pic.get("countVotes")]});
      }

      response.success({
        "result": true,
        "month": core.Month.getCurrentMonth(),
        "series": series,
        "categories": categories
      });
    }
  });
});

/**
 * The listMonths Parse CloudCode Functions responses
 * with a JSON response containing a 'months' array of
 * months represented as String in format "mmYYYY".
 **/
Parse.Cloud.define("listMonths", function(request, response)
{
  var pictures = new Parse.Query(models.Picture)
  pictures.select("month");
  pictures.descending("createdAt");
  pictures.find({
    success: function(pictures)
    {
      if (! pictures)
        pictures = [];

      var object = {};
      var months = [];
      for (var i = 0; i < pictures.length; i++) {
        var month_id   = pictures[i].get("month");
        if (object[month_id])
          continue;

        var this_month = {
          "id": month_id,
          "label": core.Month.getLabel(month_id)
        };
        months.push(this_month);
        object[month_id] = true;
      }

      response.success({
        "result": true,
        "months": months
      });
    }
  });
});

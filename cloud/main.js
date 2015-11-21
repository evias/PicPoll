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
 * @subpackage Parse CloudCode Functions
 * @author Grégory Saive <greg@evias.be>
 * @license http://www.apache.org/licenses/LICENSE-2.0
 * @link https://picpoll.parseapp.com
**/
require('cloud/app.js');

/*******************************************************************************
 * Models classes definition for PicPoll
 * @link https://picpoll.parseapp.com
 *******************************************************************************/
/**
 * Model class Picture
 * This class describes a Feedback Customer in the Parse App.
 * It simply extends the Parse.Object object with no method
 * descriptions as of now.
 **/
var Picture = Parse.Object.extend("Picture",
  {},
  {}
);
/* end Model Picture */

var Month = Parse.Object.extend("Picture",
  {},
  {
    getCurrentMonth: function()
    {
      var dt = new Date();
      var mon  = dt.getMonth() + 1; mon = mon < 10 ? "0" + "" + mon : mon;
      var year = dt.getFullYear();

      return "" + mon + "" + year;
    }
  }
);

// Make sure our Models are loaded in queries.
Parse.Object.registerSubclass("Picture", Picture);

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
  var pictures = new Parse.Query(Picture)
  pictures.equalTo("month", Month.getCurrentMonth());
  pictures.descending("createdAt");
  pictures.find({
    success: function(pictures)
    {
      if (! pictures)
        pictures = [];

      response.success({
        "result": true,
        "month": Month.getCurrentMonth(),
        "pictures": pictures
      });
    }
  });
});

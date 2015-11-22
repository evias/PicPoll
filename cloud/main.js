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
  var pictures = new Parse.Query(models.Picture)
  pictures.equalTo("month", core.Month.getCurrentMonth());
  pictures.descending("createdAt");
  pictures.find({
    success: function(pictures)
    {
      if (! pictures)
        pictures = [];

      response.success({
        "result": true,
        "month": core.Month.getCurrentMonth(),
        "pictures": pictures
      });
    }
  });
});

Parse.Cloud.define("saveVote", function(request, response)
{
  var pictureId  = request.params.pictureId;
  var userHash   = request.params.userHash;

  // load Picture pointer, then insert
  // a new Vote entry.
  var thePicture = new Parse.Query(models.Picture);
  thePicture.get(pictureId, {
  success: function(thePicture) {
    var theVote = new models.Vote();
    theVote.set("picture", thePicture);
    theVote.set("userHash", userHash);
    theVote.save(null, {
    success: function(theVote) {
      response.success({"result": true, "vote": theVote});
    },
    error: function(error) { response.error(error.message); }
    });
  },
  error: function(error) { response.error(error.message); }
  });
});

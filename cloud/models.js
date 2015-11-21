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
 * @subpackage Parse CloudCode Data Models
 * @author Grégory Saive <greg@evias.be>
 * @license http://www.apache.org/licenses/LICENSE-2.0
 * @link https://picpoll.parseapp.com
**/

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

var Month = Parse.Object.extend("Month",
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
Parse.Object.registerSubclass("Month", Month);

exports.Picture = Picture;
exports.Month = Month;

module.exports = exports;

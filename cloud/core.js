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
 * @subpackage Core
 * @author Grégory Saive <greg@evias.be>
 * @license http://www.apache.org/licenses/LICENSE-2.0
 * @link https://picpoll.parseapp.com
**/

var Month = Parse.Object.extend("Month",
  {},
  {
    i18n: {
      "en_US": {
        "01": "January", "02": "February", "03": "March",
        "04": "April", "05": "May", "06": "June",
        "07": "July",  "08": "August", "09": "September",
        "10": "October", "11": "November", "12": "December"},
      "fr_FR": {
        "01": "Janvier", "02": "Février", "03": "Mars",
        "04": "Avril", "05": "Mai", "06": "Juin",
        "07": "Juillet", "08": "Aôut", "09": "Septembre",
        "10": "Octobre", "11": "Novembre", "12": "Décembre"},
      "de_DE": {
        "01": "Januar", "02": "Februar", "03": "März",
        "04": "April", "05": "Mai", "06": "Juni",
        "07": "Juli", "08": "August", "09": "September",
        "10": "Oktober", "11": "November", "12": "Dezember"},
    },
    getCurrentMonth: function()
    {
      var dt = new Date();
      var mon  = dt.getMonth() + 1; mon = mon < 10 ? "0" + "" + mon : mon;
      var year = dt.getFullYear();

      return "" + mon + "" + year;
    },
    getLabel: function(monthId)
    {
      if (! monthId.length)
        return "January 1970";

      var month = monthId.substring(0, 2);
      var year  = monthId.substring(2);

      return Month.i18n['en_US'][month] + " " + year;
    }
  }
);

Parse.Object.registerSubclass("Month", Month);

exports.Month = Month;
module.exports = exports;

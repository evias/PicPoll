
### [0.6.1](https://github.com/evias/PicPoll/compare/fe432a1...2c86794)

* implement file upload features, uses Parse /files REST API.
* add loading of Parse.Config into locals PicPollConfig
* implement CloudCode function listMonths for building Archives links
  in navigation.
* add Statistics Chart ; several bugfixes.
* integrate Highcharts(+3D) jQuery plugin
* implement CloudCode function getStatistics
* several CSS bugfixes, typo and HTML integrations bugfixes

### [0.5.0](https://github.com/evias/PicPoll/compare/e24c3e7...fe432a1)

* implement onBeforeNext for ajax call to /saveVote and use of Parse
  CloudCode function saveVote.
* integrate jTinder PR#1 + PR#6 ; add like/dislike actions
* integrated Pull Request 1 and 5 from https://github.com/do-web/jTinder/pulls

### [0.4.0](https://github.com/evias/PicPoll/compare/8b4d15e...e24c3e7)

* integrate jTinder plugin for tinder like picture voting.
* changes to styles, theme changes.

### [0.3.0](https://github.com/evias/PicPoll/compare/6e913fd...8b4d15e)

* implement saveVote CloudCode function ; implement /saveVote
  HTTP POST handler.
* add Vote model ; implement CloudCode function saveVote
* add demo to README ; move Month class to core.js ; change subpackages
  definition in doccomments

### [0.2.0](https://github.com/evias/PicPoll/compare/aacc7b5...6e913fd)

* implement models.js ; add response locals currentUser and currentMonth
* implement /signin and /signup views ; add bootstrap.min.css for form design

### [0.1.0](https://github.com/evias/PicPoll/compare/e7bec8e...aacc7b5)

* 0.1.0: working Frontend with Parse CloudCode App
* bugfix /saveVote ; bugfix google Source Sans Pro font request scheme
* public PicPoll working FrontEnd - taken over from potm.evias.be - will now
  be developed using nodeJS + Express + Parse CloudCode

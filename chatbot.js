var request = require('request');
var dateFormat = require('dateformat');

var TOKEN_CAPILLARY = process.env.INCOMING_WEBHOOK_PATH_TO_CAPILLARY

module.exports = function (req, res, next) {
  var userName = req.body.user_name;
  var token = req.body.token;
  var responsedPayload = {
    text : ''
  }

  // avoid infinite loop
  if (userName === 'slackbot'){
    return res.status(200).end();
  }

    if(req.body.text.indexOf('吃什麼') > -1){
      responsedPayload.text = hanChiToEat();
    }else if(req.body.text.indexOf('NBA') > -1){
      responsedPayload.text = '姆姆某某姆揪吉-.-...';
      sendNbaWebhook(TOKEN_CAPILLARY);
    }else if(req.body.text.indexOf('-.-') > -1){
      responsedPayload.text = '-.-';
    }



  return res.status(200).json(responsedPayload);
}

/* API Methods */

function hanChiToEat () {
  var items = Array('憨吉餐','爽der餐','吃個微爽的','-.-');
  return items[Math.floor(Math.random()*items.length)];
}

function sendNbaWebhook (tokenToSend) {
  var day=dateFormat(new Date(), "yyyymmdd");
  request('http://data.nba.com/5s/json/cms/noseason/scoreboard/' + day + '/games.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsdonData = JSON.parse(body);
      var visitor = jsdonData.sports_content.games.game[0].visitor
      var home = jsdonData.sports_content.games.game[0].home

      var nbaResponsePayload = {
        text : '今日NBA比賽 ：' + visitor.team_key + '(客) 對戰 ' + home.team_key + '(主)'
      }

      send(tokenToSend, nbaResponsePayload, function (error, status, body) {
        if (error) {
          return next(error);
        } else if (status !== 200) {
          return next(new Error('Incoming WebHook Fail: ' + status + ' ' + body));
        } else {
          return res.status(200).end();
        }
      });

    }
  })
}

/* Helper Methods */

function send (path, payload, callback) {
  var uri = 'https://hooks.slack.com/services/' + path;
  request({
    uri: uri,
    method: 'POST',
    body: JSON.stringify(payload)
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }
    callback(null, response.statusCode, body);
  });
}

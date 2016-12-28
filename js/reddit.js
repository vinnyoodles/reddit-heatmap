var request = require('request');
var sync = require('synchronize');
var _ = require('underscore');

const TYPE_TO_FIELDS_MAPPING = {
  submitted: ['id', 'permalink', 'created', 'title', 'score', 'subreddit'],
  comments: ['id', 'link_url', 'created', 'subreddit', 'link_title', 'body']
};

function reddit(req, res) {
  var user = req.query.user;
  // TODO(Vincent) Add upvoted and downvoted data.
  var dataTypes = ['submitted', 'comments'];
  _.map(dataTypes, (type) => {
    var data = _fetchRedditData(user, type);
  });
  res.status(200).send({ user });
}

function _fetchRedditData(user, endpoint) {
  var response = sync.await(request(`https://www.reddit.com/user/${user}/${endpoint}.json?limit=100`, sync.defer()));
  if (response.statusCode !== 200) return [];

  var payload = JSON.parse(response.body);
  if (_.isEmpty(payload) || _.isEmpty(payload.data.children)) return [];

  var fields = TYPE_TO_FIELDS_MAPPING[endpoint];
  return _.map(payload.data.children, ({ data }) => _.pick(data, fields));
}

module.exports = reddit;

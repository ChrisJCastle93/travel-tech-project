const { TwitterApi } = require("twitter-api-v2");
const client = new TwitterApi({
  appKey: process.env.twitter_key,
  appSecret: process.env.twitter_secret,
  accessToken: process.env.twitter_access,
  accessSecret: process.env.twitter_token_secret,
});

const sendTweet = (title, id) => {
  client.v2.tweet(`"${title}"

  http://www.trustedtraveltech.com/companies/${id}`
  ).then((response) => console.log(response));
};

module.exports = sendTweet;
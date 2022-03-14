const { TwitterApi } = require("twitter-api-v2");
const client = new TwitterApi({
  appKey: process.env.twitter_key,
  appSecret: process.env.twitter_secret,
  accessToken: process.env.twitter_access,
  accessSecret: process.env.twitter_token_secret,
});

const sendTweet = (tweetText) => {
  client.v2.tweet(`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`).then((response) => console.log(response));
};

module.exports = sendTweet;
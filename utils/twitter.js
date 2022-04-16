const { TwitterApi } = require("twitter-api-v2");
const client = new TwitterApi({
  appKey: process.env.twitter_key,
  appSecret: process.env.twitter_secret,
  accessToken: process.env.twitter_access,
  accessSecret: process.env.twitter_token_secret,
});

// This is a simple Twitter Bot - whenever a review is left, it tweets to this profile: https://twitter.com/TrustedTravelT

const sendTweet = (review, company) => {
  client.v2
    .tweet(
      `New review posted about: ${company.profile.name}
  
  "${review.content.reviewTitle}"

  http://www.trustedtraveltech.com/companies/${company.id}`
    )
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
};

module.exports = sendTweet;

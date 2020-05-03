const TwitterAPI = require("node-twitter-api");
const readline = require("readline");

const twitter = new TwitterAPI({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callback: "oob",
});

const start = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const requestToken = await new Promise((res, rej) =>
      twitter.getRequestToken((e, token, tokenSecret, results) =>
        e ? rej(e) : res({ token, tokenSecret, results })
      )
    );
    console.log(JSON.stringify(requestToken, null, 2));
    console.log(
      `https://twitter.com/oauth/authenticate?oauth_token=${requestToken.token}`
    );
    const pin = await new Promise((res) => rl.question("Enter pin: ", res));

    const accessToken = await new Promise((res, rej) =>
      twitter.getAccessToken(
        requestToken.token,
        requestToken.tokenSecret,
        pin,
        (e, accessToken, accessTokenSecret, results) =>
          e ? rej(e) : res({ accessToken, accessTokenSecret, results })
      )
    );
    console.log(JSON.stringify(accessToken, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    rl.close();
  }
};

start();

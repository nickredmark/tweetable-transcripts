const TwitterAPI = require("node-twitter-api");

const twitter = new TwitterAPI({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callback: "oob",
});

const start = async () => {
  try {
    const res = await new Promise((res, rej) =>
      twitter.statuses(
        "update",
        {
          status:
            "@SmartAlcibiades I dare say that you may be surprised to find, O son of\nCleinias, that I, who am your first lover, not having spoken to you\nfor many years, when the rest of the world were wearying you with their\nattentions, am the last of your lovers who still speaks to you.",
        },
        process.env.NICKREDMARK_ACCESS_TOKEN,
        process.env.NICKREDMARK_ACCESS_TOKEN_SECRET,
        (e, data, response) => (e ? rej(e) : res({ data, response }))
      )
    );
    console.log(res.data);
  } catch (e) {
    console.error(e);
  }
};

start();

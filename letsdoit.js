const TwitterAPI = require("node-twitter-api");
const { readFileSync, writeFileSync } = require("fs");

const twitter = new TwitterAPI({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callback: "oob",
});

const SCRIPT = "alcibiades";

const start = async () => {
  try {
    while (true) {
      const timeout = await step();
      console.log(`Waiting ${timeout / 60 / 1000}m.`);
      await new Promise((res) => setTimeout(res, timeout));
    }
  } catch (e) {
    console.error(e);
  }
};

const MINUTE = 60 * 1000;
const FIFTEEN_MINUTES = 15 * MINUTE;

const step = async () => {
  const status = JSON.parse(readFileSync("./status.json", "utf8"));

  const script = require(`./data/${SCRIPT}.json`);

  let current = 0;
  for (let i = 0; i < script.length; i++) {
    const segment = script[i];
    for (let j = 0; j < segment.text.length; j++) {
      if (current === status.current) {
        const tweet = {
          status: segment.text[j],
        };
        if (status.lastTweet) {
          tweet.in_reply_to_status_id = status.lastTweet.id_str;
          tweet.auto_populate_reply_metadata = true;
        }
        console.log(tweet);
        const res = await new Promise((res, rej) =>
          twitter.statuses(
            "update",
            tweet,
            process.env[`${segment.author}_ACCESS_TOKEN`],
            process.env[`${segment.author}_ACCESS_TOKEN_SECRET`],
            (e, data, response) => (e ? rej(e) : res({ data, response }))
          )
        );
        writeFileSync(
          "./status.json",
          JSON.stringify(
            {
              current: status.current + 1,
              lastTweet: res.data,
            },
            null,
            2
          )
        );
        return j === segment.text.length - 1 ? FIFTEEN_MINUTES : MINUTE;
      }
      current++;
    }
  }

  throw new Error("Done?");
};

start();

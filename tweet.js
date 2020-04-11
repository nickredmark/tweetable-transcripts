const Twit = require("twit");
const twit = new Twit({
  consumer_key: process.env.ACONSUMER_KEY,
  consumer_secret: process.env.ACONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const start = async () => {
  const res = await new Promise((res, rej) =>
    twit.post(
      "statuses/update",
      {
        status: "hello",
      },
      (e, data, _response) => (e ? rej(e) : res(data))
    )
  );
};

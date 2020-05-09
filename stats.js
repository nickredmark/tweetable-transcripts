const SCRIPT = "jimrutt8";
const data = require(`./data/${SCRIPT}.json`);

console.log("Chunks: ", data.length);
console.log(
  "Tweets:",
  data.reduce((sum, author) => sum + author.text.length, 0)
);
console.log(
  "Duration (days): ",
  Math.round(
    data.reduce((sum, author) => sum + 14 + author.text.length, 0) / 60 / 24
  )
);
console.log(
  "Longest tweet:",
  data.reduce(
    (max, author) =>
      Math.max(
        max,
        author.text.reduce((max, line) => Math.max(max, line.length), 0)
      ),
    0
  )
);

const { readFileSync, writeFileSync } = require("fs");

const LIMIT = 280;

const levels = [
  /$/,
  /(?<=[\.?$]['”]?)[ \n]*/,
  /(?<=[;\.?$]['”]?)[ \n]*/,
  /(?<=[,;\.?$]['”]?)[ \n]*/,
  /[,;\.?$ \n]/,
];

const MAP_AUTHOR = {
  "Jim Rutt": "JIM_RUTT",
  "Jordan Hall": "JORDAN_HALL",
};

const split = (text) => {
  const parts = [];

  while (text.length) {
    let part = "";
    let separator = "";
    for (const level of levels) {
      // add as many elements of the highest level as possible
      let match;
      while (text.length && (match = new RegExp(level).exec(text)) !== null) {
        if (part.length + separator.length + match.index <= LIMIT) {
          part = `${part}${separator}${text.substr(0, match.index)}`;
          separator = match[0];
          text = text.substr(match.index + match[0].length);
        } else {
          break;
        }
      }
      if (part.length) {
        break;
      }
    }
    parts.push(part);
  }

  return parts;
};

const dialogue = "jimrutt8";

const raw = readFileSync(`./data/${dialogue}.txt`, "utf8");

const lines = raw
  .replace(/\(compare[^)]+\) ?/gi, "")
  .split(/\n\n(?=\w[\w ]*:)/)
  .map((line) => line.replace(/\n/g, " "))
  .filter(Boolean);

const messages = [];
messages.push({
  author: "JIM_RUTT",
  text: [
    "EP8 Jordan “Greenhall” Hall and Game B\nhttps://www.jimruttshow.com/jordan-greenhall-hall/",
  ],
});
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = /^(\w[\w ]*): ?((.|\n)+)$/.exec(line);
  let text = match[2]
    .replace(/Jim Rutt/g, "@JimRuttBot")
    .replace(/\bJim\b/g, "@JimRuttBot")
    .replace(/Jordan Hall/g, "@JordanHallBot")
    .replace(/\bJordan\b/g, "@JordanHallBot");
  if (i === 0) {
    text = `@JordanHallBot ${text}`;
  }
  messages.push({
    author: MAP_AUTHOR[match[1]],
    text: split(text),
  });
}

console.log(messages.reduce((count, m) => count + m.text.length, 0));

writeFileSync(`./data/${dialogue}.json`, JSON.stringify(messages, null, 2));

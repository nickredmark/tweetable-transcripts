const alcibiades = require("./data/alcibiades.json");

console.log(alcibiades.length);
console.log(alcibiades.reduce((sum, author) => sum + author.text.length, 0));
console.log(
  alcibiades.reduce(
    (max, author) =>
      Math.max(
        max,
        author.text.reduce((max, line) => Math.max(max, line.length), 0)
      ),
    0
  )
);

const fs = require("fs");

const commandMap = new Map();

// load normal files
const files = fs.readdirSync("./commands");

for (let file of files) {
  if (file === "generated.js") continue;

  const cmd = require(`./commands/${file}`);
  if (cmd.name) commandMap.set(cmd.name, cmd);
}

// load generated commands
const generated = require("./commands/generated");

generated.forEach(cmd => {
  commandMap.set(cmd.name, cmd);
});

module.exports = commandMap;

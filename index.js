const fs   = require("node:fs");
const path = require("node:path");

const { Client, Collection, GatewayIntentBits } = require("discord.js");

const { token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const eventsPath   = path.join(__dirname, "events");
const commandsPath = path.join(__dirname, "commands");

String.prototype.toTitleCase = function () {
  let i; let j; let str;
  const lowers = ["A", "An", "The", "And", "But", "Or", "For", "Nor", "As", "At", "By", "For", "From", "In", "Into", "Near", "Of", "On", "Onto", "To", "With"];
  const uppers = ["Id", "Tv", "Lw", "Rw", "Ld", "Rd", "Dm", "Nhl", "Ahl", "Gm"];

  str = this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  for (i = 0, j = lowers.length; i < j; i++) {
    str = str.replace(new RegExp(`\\s${lowers[i]}\\s`, "g"), (txt) => txt.toLowerCase());
  }

  for (i = 0, j = uppers.length; i < j; i++) {
    str = str.replace(new RegExp(`\\b${uppers[i]}\\b`, "g"), uppers[i].toUpperCase());
  }

  return str;
};

Number.prototype.pad = function (size) {
  let s = String(this);
  while (s.length < (size || 2)) { s = `0${s}`; }
  return s;
};

const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event    = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.commands    = new Collection();
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command  = require(filePath);
  client.commands.set(command.data.name, command);
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:\n", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Promise Exception:\n", err);
});
process.on("uncaughtExceptionMonitor", (err) => {
  console.error("Uncaught Promise Exception (Monitor):\n", err);
});

client.login(token);

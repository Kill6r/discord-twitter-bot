/* CONSOLE */
require("console-stamp")(console, { format: ":date(HH:MM:ss).bold.grey" });

const Discord = require("discord.js");
const Utils = require("./Modules/Utils.js");
const colors = require("colors");
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
  partials: [Discord.Partials.Channel, Discord.Partials.Message],
});
const config = Utils.config();
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const fetch = globalThis.fetch;

process.on("unhandledRejection", (err) => {
  if (err.code === "TOKEN_INVALID" || err.code === 0) {
    /* Error */

    Utils.logInfo(
      "#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#"
    );
    Utils.logInfo(
      "                                                                          "
    );
    Utils.logInfo(
      `                    • ${chalk.bold(
        `custom_bot Bot v${config.Version}`
      )} is now Offline! •       `
    );
    Utils.logInfo(
      "                                                                          "
    );
    Utils.logInfo(
      "                 • If you need any help you can contact me •          "
    );
    Utils.logInfo(
      `                      Website: ${chalk.blue(
        chalk.underline(`https://es.fiverr.com/kill6r `)
      )}                        `
    );
    Utils.logInfo(
      `                      Discord: ${chalk.blue(
        `Kill6r#0696 (343929946315554816)`
      )}                        `
    );
    Utils.logInfo(
      `                      Email: ${chalk.blue(
        `jesusmontalvog1@gmail.com`
      )}                        `
    );
    Utils.logInfo(
      "                                                                          "
    );
    Utils.logInfo(
      "#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#"
    );
    Utils.logError("Login failed.");
    Utils.logError(err.message);
    process.exit(0);
  }
  Utils.logError(err.stack);
});
process.on("uncaughtException", (err) => {
  if (err.code === "TOKEN_INVALID" || err.code === 0) {
    /* Error */

    Utils.logInfo(
      "#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#"
    );
    Utils.logInfo(
      "                                                                          "
    );
    Utils.logInfo(
      `                    • ${chalk.bold(
        `custom_bot Bot v${config.Version}`
      )} is now Offline! •       `
    );
    Utils.logInfo(
      "                                                                          "
    );
    Utils.logInfo(
      "                 • If you need any help you can contact me •          "
    );
    Utils.logInfo(
      `                      Website: ${chalk.blue(
        chalk.underline(`https://es.fiverr.com/kill6r `)
      )}                        `
    );
    Utils.logInfo(
      `                      Discord: ${chalk.blue(
        `Kill6r#0696 (343929946315554816)`
      )}                        `
    );
    Utils.logInfo(
      `                      Email: ${chalk.blue(
        `jesusmontalvog1@gmail.com`
      )}                        `
    );
    Utils.logInfo(
      "                                                                          "
    );
    Utils.logInfo(
      "#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#"
    );
    Utils.logError("Login failed.");
    Utils.logError(err.message);
    process.exit(0);
  }
  Utils.logError(err.stack);
});

/* LOGIN */
client.login(config.Settings.Bot.Token);

/* COLLECTIONS */
client.sesion = [];
client.comandos = new Discord.Collection();
client.esnipes = new Discord.Collection();
client.snipes = new Discord.Collection();
client.Events = [];
client.Commands = [];
client.SlashCommands = [];

/* HANDLERS */
["comandos", "eventos", "slashs"].forEach((handler) => {
  require(`./handlers/${handler}`)(client, config);
});

/* DATABASE */
require("./database/connect.js")(config);

/* Uptime 24/7 */

const express = require("express");
const app = express();

app.use(express.static("public"));
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>");
});
app.listen(process.env.PORT || 1000);

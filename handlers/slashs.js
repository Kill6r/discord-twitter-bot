const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const chalk = require("chalk");
const { Routes } = require("discord-api-types/v9");
const Utils = require("../Modules/Utils.js");

module.exports = async (client, config) => {
  client.slashs = new Discord.Collection();
  client.slashcommands = new Discord.Collection();
  const slashcommandsFiles = fs
    .readdirSync("./slashs")
    .filter((file) => file.endsWith(".js"));

  const nameFiles = [];
  for (const file of slashcommandsFiles) {
    const slash = require(`../slashs/${file}`);
    client.slashcommands.set(slash.data.name, slash);
    nameFiles.push(file);
  }

  const commands = [];
  const slashcommandsFiles2 = fs
    .readdirSync("./slashs")
    .filter((file) => file.endsWith(".js"));

  for (const file of slashcommandsFiles2) {
    const slash = require(`../slashs/${file}`);
    commands.push(slash.data.toJSON());
  }
  const { readdirSync } = require("fs");
  const ascii = require("ascii-table");
  let table = new ascii("Slashs");
  table.setBorder("|", "-", "#", "#");
  table.setHeading("Slash Command", "Description");
  let cantidad;
  if (commands.length > nameFiles.length === true) cantidad = commands;
  if (commands.length > nameFiles.length === false) cantidad = nameFiles;
  if (commands.length === nameFiles.length) cantidad = nameFiles;
  for (let i = 0; i < cantidad.length; i++) {
    client.SlashCommands.push(commands[i]);
    table.addRow(`${nameFiles[i]}`, `${commands[i].description}`);
  }
  /* Utils.logInfo(chalk.blue('\n' + table.toString())); */

  const rest = new REST({ version: "9" }).setToken(config.Settings.Bot.Token);

  createSlash();
  async function createSlash() {
    await rest.put(Routes.applicationCommands(config.Settings.Bot.ClientId), {
      body: commands,
    });
  }
};

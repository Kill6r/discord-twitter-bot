const Utils = require("../../Modules/Utils.js");
const chalk = require("chalk");
const Discord = require("discord.js");
const Embed = Discord.EmbedBuilder;
const config = Utils.config();
module.exports = {
  name: "ready",
  run: async (client) => {
    let bot = client;

    /* Info */
    Utils.logInfo(
      "#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#"
    );
    Utils.logInfo(
      "                                                                          "
    );
    Utils.logInfo(
      `                    • ${chalk.bold(
        `custom_bot Bot v${config.Version}`
      )} ahora está en línea! •       `
    );
    Utils.logInfo(
      "                                                                          "
    );
    Utils.logInfo(
      "                 • Si necesitas ayuda puedes contactar conmigo •          "
    );
    Utils.logInfo(
      `                      Website: ${chalk.blue(
        chalk.underline(`https://es.fiverr.com/kill6r `)
      )}                        `
    );
    Utils.logInfo(
      `                      Discord: ${chalk.blue(
        `kill6r (734189157097930862)`
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
    Utils.logInfo(
      `${chalk.bold(bot.Events.length)} Evento${
        bot.Events.length == 1 ? "" : "s"
      } cargado${bot.Events.length == 1 ? "" : "s"} ${chalk.gray(
        "("
      )} ${chalk.underline.bold.yellow(
        `${bot.Events.map((i) => `${i}`)}`
      )} ${chalk.gray(")")}.`
    );
    Utils.logInfo(
      `${chalk.bold(bot.SlashCommands.length)} Comando${
        bot.SlashCommands.length == 1 ? "" : "s"
      } de Slash cargado${
        bot.SlashCommands.length == 1 ? "" : "s"
      } (${chalk.bold("/")}) ${chalk.gray("(")} ${chalk.underline.bold.yellow(
        `${bot.SlashCommands.map((i) => `${i.name}`)}`
      )} ${chalk.gray(")")}.`
    );
    Utils.logInfo(
      `${chalk.bold(bot.Commands.length)} Comando${
        bot.Commands.length == 1 ? "" : "s"
      } cargado${bot.Commands.length == 1 ? "" : "s"} ${chalk.gray(
        "("
      )} ${chalk.underline.bold.yellow(
        `${bot.Commands.map((i) => `${i}`)}`
      )} ${chalk.gray(")")}.`
    );
    Utils.logInfo(
      `Esta actualmente en ${chalk.underline.bold.yellow(
        bot.guilds.cache.size
      )} servidor${bot.guilds.cache.size > 1 ? "es" : ""}.`
    );
    Utils.logInfo(
      `Bot listo! ${chalk.gray("(")} ${chalk.underline.bold.blue(
        `${bot.user.username}`
      )}${chalk.underline.bold.white("#")}${chalk.underline.bold.yellow(
        `${bot.user.discriminator}`
      )} ${chalk.gray(")")}`
    );
  },
};

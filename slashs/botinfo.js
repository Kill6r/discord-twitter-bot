const Discord = require("discord.js");
const Utils = require("../Modules/Utils.js");
const osu = require("node-os-utils");
const packages = require("../package.json");
const { usagePercent } = require("cpu-stat");
const Embed = Discord.EmbedBuilder;
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("View bot information."),
  cooldown: "5s",
  async run(client, interaction, cooldown) {
    /* Cooldown */
    cooldown();

    /* Count Members */
    let users = 0;
    client.guilds.cache.forEach((guild) => {
      users += guild.memberCount;
    });

    let int = interaction;
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;

    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    let minutes = Math.floor(totalSeconds / 60);
    totalSeconds %= 60;

    let seconds = Math.floor(totalSeconds % 60);
    totalSeconds %= 60;

    let time = Utils.timeFormat({
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    });

    usagePercent(function (error, percent) {
      if (error) return message.reply(error);
      const memoryusage = formatBytes(process.memoryUsage().heapUsed);
      const os = require("os");
      const CPU = percent.toFixed(2);
      const CPUModel = os.cpus()[0].model;
      var mem = osu.mem;

      mem.info().then((info) => {
        let MEMORY = info.usedMemPercentage;
        const cpuEmoji =
          CPU <= 0
            ? "`                     `"
            : CPU < 10
            ? "`█████               `"
            : CPU < 20
            ? "`███████             `"
            : CPU < 30
            ? "`████████             `"
            : CPU < 40
            ? "`███████████          `"
            : CPU < 50
            ? "`█████████████        `"
            : CPU < 60
            ? "`███████████████      `"
            : CPU < 70
            ? "`████████████████     `"
            : CPU < 80
            ? "`█████████████████    `"
            : CPU < 99
            ? "`██████████████████   `"
            : CPU < 100
            ? "`█████████████████████`"
            : CPU < 200
            ? "`█████████████████████`"
            : `                     `;
        const memoryEmoji =
          MEMORY <= 0
            ? "`                     `"
            : MEMORY < 10
            ? "`█████               `"
            : MEMORY < 20
            ? "`███████             `"
            : MEMORY < 30
            ? "`████████             `"
            : MEMORY < 40
            ? "`███████████          `"
            : MEMORY < 50
            ? "`█████████████        `"
            : MEMORY < 60
            ? "`███████████████      `"
            : MEMORY < 70
            ? "`████████████████     `"
            : MEMORY < 80
            ? "`█████████████████    `"
            : MEMORY < 99
            ? "`██████████████████   `"
            : MEMORY < 100
            ? "`█████████████████████`"
            : MEMORY < 200
            ? "`█████████████████████`"
            : `                     `;
        const embed = new Embed()
          .setAuthor({
            name: int.guild.name,
            iconURL: int.guild.iconURL({
              dynamic: true,
              size: 1024,
            }),
          })
          .addFields(
            { name: "Name", value: `${client.user.username}`, inline: true },
            { name: "Creator", value: "<@734189157097930862>", inline: true },
            { name: "Version", value: "v1.0.2", inline: true },
            { name: "Node.js Version", value: process.version, inline: true },
            {
              name: "Library",
              value: packages.dependencies["discord.js"],
              inline: true,
            },
            { name: "Operating System", value: "Linux", inline: true },
            { name: "Uptime", value: `${time}`, inline: true },
            {
              name: "Servers",
              value: `Servers: ${client.guilds.cache.size}`,
              inline: true,
            },
            { name: "Users", value: `Total members: ${users}`, inline: true },
            {
              name: "Memory Usage",
              value: `${memoryEmoji} [**${MEMORY}**%]`,
              inline: true,
            },
            {
              name: "CPU Usage",
              value: `${cpuEmoji} [**${CPU}**%]`,
              inline: true,
            },
            { name: "CPU Model", value: `${CPUModel}`, inline: true }
          )
          .setColor(client.color);

        interaction.reply({ embeds: [embed] });
      });
    });

    function formatBytes(a, b) {
      let c = 1024; // 1 GB = 1024 MB
      let e = ["B", "KB", "MB", "GB", "TB"];
      let f = Math.floor(Math.log(a) / Math.log(c));

      return parseFloat((a / Math.pow(c, f)).toFixed(2)) + "" + e[f];
    }
  },
};

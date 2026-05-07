const Discord = require("discord.js");
const embed = Discord.EmbedBuilder;
const db = require("../../database/Models/Guild.js");

module.exports = {
  name: "setcolor",
  aliases: [],
  usage: "setcolor <Hex> (https://www.htmlcsscolor.com/404)",
  categoria: "",
  run: async (client, message, args) => {
    console.log(args);

    if (!args[0]) {
      let embed2 = new embed()
        .setAuthor({
          name: "Invalid arguments",
        })
        .setDescription(
          `Usage: ${client.prefix}setcolor <Hex/Red/Blue/Green/Yellow/White/Black>`
        )
        .setColor(client.color);
      return message.channel.send({ embeds: [embed2] });
    }

    let replace = `${args[0]}`
      .toLowerCase()
      .replace("red", "#FF0000")
      .replace("blue", "#00BCFF")
      .replace("green", "#00FF00")
      .replace("yellow", "#FFFF00")
      .replace("white", "#FFFFFF")
      .replace("black", "#000000");

    await db.updateOne({ guildId: message.guild.id }, { color: replace });
    let data = await db.findOne({ guildId: message.guild.id }).exec();

    let embed3 = new embed()
      .setAuthor({
        name: "Color Changed",
      })
      .setDescription(`The color default has been changed to ${replace}`)
      .setColor(data.color);
    message.channel.send({ embeds: [embed3] });
  },
};

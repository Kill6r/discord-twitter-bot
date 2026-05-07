const Discord = require("discord.js");
const { findOneAndUpdate } = require("../../database/Models/Guild.js");
const db = require("../../database/Models/Guild.js");
const Embed = Discord.EmbedBuilder;

module.exports = {
  name: "setprefix",
  aliases: [],
  usage: "setprefix <New Prefix>",
  cooldown: 10,
  categoria: "Administracion",
  run: async (client, message, args) => {
    if (message.member.id !== "343929946315554816") {
      if (message.member.permissions.has("ADMINISTRATOR") === false) return;
    }
    let query = args[0];
    let embed = new Discord.MessageEmbed()
      .setTitle("Invalid arguments")
      .setDescription(`Usage: ${client.prefix}prefix <new prefix>`)
      .setColor(client.color);

    if (!query) return message.reply({ embeds: [embed] });

    await db.updateOne({ guildId: message.guild.id }, { prefix: query });
    let embed2 = new Embed()
      .setTitle("New Prefix")
      .setDescription(`My new prefix is ${query}`)
      .setColor(client.color);
    message.channel.send({ embeds: [embed2] });
  },
};

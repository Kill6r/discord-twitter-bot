const Discord = require("discord.js");
const Row = Discord.MessageActionRow;
const Embed = Discord.MessageEmbed;
const Button = Discord.MessageButton;

module.exports = {
  name: "test",
  aliases: [],
  usage: "Custom Command",
  cooldown: 5,
  categoria: "Administracion",
  run: async (client, message, args, db, command) => {
    if (message.member.id !== "343929946315554816") {
      if (message.member.permissions.has("ADMINISTRATOR") === false) return;
    }
    let data = command;

    let answersUpdate = [];
    let answers = [
      data.message.title,
      data.message.description,
      data.message.footer,
      data.message.footer_icon,
      data.message.image,
      data.message.thumbnail,
    ];
    answers.forEach((i, index) => {
      answersUpdate.push({
        status: answers[index].status,
        content: answers[index].content,
      });
    });
    let embed = new Embed().setColor(client.color);

    if (answersUpdate[0].status === true)
      embed.setTitle(`${answersUpdate[0].content}`);
    if (answersUpdate[1].status === true)
      embed.setDescription(`${answersUpdate[1].content}`);
    if (answersUpdate[2].status === true && answersUpdate[3].status === true) {
      embed.setFooter({
        text: `${answersUpdate[2].content}`,
        iconURL: `${answersUpdate[3].content}`,
      });
    } else if (answersUpdate[2].status === true) {
      embed.setFooter({
        text: `${answersUpdate[2].content}`,
      });
    } else if (answersUpdate[3].status === true) {
      embed.setFooter({
        iconURL: `${answersUpdate[3].content}`,
      });
    }
    if (answersUpdate[4].status === true)
      embed.setImage(`${answersUpdate[4].content}`);
    if (answersUpdate[5].status === true)
      embed.setThumbnail(`${answersUpdate[5].content}`);

    await message.channel.send({ embeds: [embed] });
  },
};

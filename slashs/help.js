const Discord = require("discord.js");
const os = require("os");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Help."),
  cooldown: "3s",
  async run(client, interaction, cooldown) {
    /* Cooldown */
    cooldown();

    let comandos = client.comandos;
    let slashcommands = client.slashcommands;
    let c = "`";
    let int = interaction;
    const embed = new Discord.EmbedBuilder()
      .setTitle("List of commands")
      .setDescription(
        `**Normal Commands**\n${comandos
          .map((index, value) => `${c}${index.name}${c}`.replace(".js"))
          .join(",")}\n**Slash Commands**\n${slashcommands
          .map((index, value) => `${c}${index.data.name}${c}`.replace(".js"))
          .join(",")}`
      )
      .setColor(client.color)
      .setTimestamp();
    int.reply({ embeds: [embed], ephemeral: true });
  },
};

const Discord = require("discord.js");
const Embed = Discord.EmbedBuilder;
const Row = Discord.ActionRowBuilder;
const Button = Discord.ButtonBuilder;
const Twitter = require("../database/Models/Twitter");
const Posts = require("../database/Models/Posts");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dejarseguir")
    .setDescription("Dejar de seguir a un perfil")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El perfil que quieres dejar seguir.")
        .setRequired(false)
    ),
  cooldown: "3s",
  async run(client, interaction, cooldown) {
    /* Cooldown */
    cooldown();

    let int = interaction;
    let user = int?.options?.get("usuario")?.user ?? int.user;
    let option = {
      guildId: int.guild.id,
      userId: user.id,
    };

    let search = await Twitter.findOne(option);
    let searchAuthor = await Twitter.findOne({
      guildId: int.guild.id,
      userId: int.user.id,
    });
    let followers = search.followers;
    console.log(followers.find((user) => user === int.user.id));

    if (user.id === int.user.id) {
      let embed = new Embed()
        .setTitle("📝 Profile | System")
        .setDescription(`No puedes dejar de seguirte a ti mismo`)
        .setColor(client.color);

      int.reply({ embeds: [embed], ephemeral: true });

      return;
    } else if (!search) {
      let embed = new Embed()
        .setTitle("💫 Follow | System")
        .setDescription(
          `No puedes seguir a <@${user.id}> debido a que el no tiene creado un perfil`
        )
        .setColor(client.color);

      int.reply({ embeds: [embed], ephemeral: true });

      return;
    } else if (!searchAuthor) {
      let embed = new Embed()
        .setTitle("💫 Follow | System")
        .setDescription(
          `No puedes seguir a <@${user.id}> debido a que no tienes un perfil, ` +
            "para crear un perfil usa el comando `/createprofile`"
        )
        .setColor(client.color);

      int.reply({ embeds: [embed], ephemeral: true });

      return;
    } else if (followers.find((user) => user === int.user.id) === undefined) {
      let embed = new Embed()
        .setTitle("💫 Follow | System")
        .setDescription(
          `No sigues a <@${user.id}>, ` +
            "si quieres seguirlo usa el comando `/seguir`"
        )
        .setColor(client.color);

      int.reply({ embeds: [embed], ephemeral: true });

      return;
    }

    let embed = new Embed()
      .setTitle("💫 Follow | System")
      .setDescription(`Has dejado de seguir a <@${user.id}>`)
      .setThumbnail(
        user.displayAvatarURL({
          dynamic: true,
          size: 1024,
        })
      )
      .setColor(client.color);

    int.reply({ embeds: [embed] });

    await Twitter.updateOne(option, { $pull: { followers: int.user.id } });
    await Twitter.updateOne(
      {
        guildId: int.guild.id,
        userId: int.user.id,
      },
      { $pull: { followed_by: user.id } }
    );
  },
};

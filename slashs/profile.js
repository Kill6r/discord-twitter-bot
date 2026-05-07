const Discord = require("discord.js");
const Embed = Discord.EmbedBuilder;
const Row = Discord.ActionRowBuilder;
const Button = Discord.ButtonBuilder;
const Twitter = require("../database/Models/Twitter");
const Posts = require("../database/Models/Posts");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription(
      "Ver tu perfil creado y otro tipo de información importante"
    )
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription(
          "Si quieres ver el perfil de una persona, pon el nombre y podrás verlo."
        )
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
    let data = await Posts.find(option);

    let likes = 0;
    data.forEach(async (i, index) => {
      likes += i.likes.length;
    });

    if (!search) {
      let embed = new Embed()
        .setTitle("📝 Profile | System")
        .setDescription(
          "No tienes un perfil, para crear un perfil usa el comando `/createprofile`"
        )
        .setColor(client.color);

      int.reply({ embeds: [embed], ephemeral: true });

      return;
    }

    let embed = new Embed()
      .setAuthor({
        name: `${search.username}`,
        iconURL: user.displayAvatarURL({
          dynamic: true,
          size: 1024,
        }),
      })
      .setTitle("📝 Profile | System")
      .setDescription(`${search.biography}`)
      .setThumbnail(
        user.displayAvatarURL({
          dynamic: true,
          size: 1024,
        })
      )
      .addFields(
        {
          name: "📩 Fecha de creación de cuenta",
          value: `<t:${search.date}>`,
          inline: true,
        },
        { name: "📄 Posts", value: `${data?.length ?? 0}`, inline: true },
        {
          name: "🔁 Retweet",
          value: `${search.replies.length}`,
          inline: true,
        },
        { name: "❤️ Likes", value: `${likes}`, inline: true },
        {
          name: "💫 Seguidos",
          value: `${search.followed_by.length}`,
          inline: true,
        },
        {
          name: "👥 Seguidores",
          value: `${search.followers.length}`,
          inline: true,
        }
      )
      .setColor(client.color);

    int.reply({ embeds: [embed] });
  },
};

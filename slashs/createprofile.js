const Discord = require("discord.js");
const Twitter = require("../database/Models/Twitter");
const Embed = Discord.EmbedBuilder;
const Row = Discord.ActionRowBuilder;
const Button = Discord.ButtonBuilder;
const Utils = require("../Modules/Utils");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("createprofile")
    .setDescription("Create your profile for post, rt, likes or comments"),
  cooldown: "3s",
  async run(client, interaction, cooldown) {
    /* Cooldown */
    cooldown();

    let int = interaction;
    let answers = [];
    let msgIDs = [];
    let questions = [
      "¿Cuál es el nombre que quieres de perfil?",
      "¿Cuál es la biografía o descripción de tu perfil?",
    ];

    let embed = new Embed()
      .setTitle("📝 | Profile System")
      .setDescription(
        "Antes de crear tu perfil, porfavor ingresa la siguiente información."
      )
      .setColor(client.color);

    await int.reply({ embeds: [embed] });

    async function final(answers, msgIDs) {
      embed = new Embed()
        .setTitle("📝 | Profile System")
        .setDescription(
          "Has creado tu perfil exitosamente.\nPara ver tu perfil, escribe `/profile`."
        )
        .setColor(client.color);

      await int.editReply({ embeds: [embed] });

      int.guild.channels
        .create({
          name: answers[0].content,
          type: Discord.ChannelType.GuildText,
          parent: "1173360742469210243",
          permissionOverwrites: [
            {
              id: int.guild.id,
              deny: [Discord.PermissionsBitField.Flags.SendMessages],
            },
            {
              id: int.user.id,
              allow: [Discord.PermissionsBitField.Flags.SendMessages],
            },
          ],
        })
        .then(async (channel) => {
          await Twitter.create({
            guildId: int.guild.id,
            channelId: channel.id,
            userId: int.user.id,
            followers: [],
            posts: [],
            date: `${`${new Date() / 1000}`.split(".")[0]}`,
            biography: answers[1].content,
            username: answers[0].content,
            replies: [],
            likes: [],
            msgs: [],
          });
        });

      await int.member.setNickname(answers[0].content);

      /* Eliminar mensajes */

      msgIDs.forEach(async (i) => {
        await int.channel.messages
          .fetch(i)
          .then(async (m) => {
            await m.delete();
          })
          .catch(async (e) => {});
      });
    }

    const askQuestion = async (i, ask) => {
      const question = questions[i];
      let texto = "{pos}";
      let embed2 = new Embed()
        .setTitle(texto.replace(/{pos}/g, `${i + 1}/` + questions.length))
        .setDescription(question)
        .setColor(client.color);
      if (ask !== false)
        await int.channel
          .send({ embeds: [embed2] })
          .then((msg) => msgIDs.push(msg.id));

      await Utils.waitForResponse(int.user.id, int.channel).then(
        async (response) => {
          msgIDs.push(response.id);
          if (i === 0) {
            let data = await Twitter.findOne({
              guildId: int.guild.id,
              username: { $regex: response.content, $options: "i" },
            });
            if (!data) {
              answers.push({
                status: true,
                content: `${response.content}`,
              });
            } else {
              let embedError = new Embed()
                .setTitle("📝 | Profile System")
                .setDescription("Este nombre ya existe, vuelve a escribir otro")
                .setColor(client.color);

              await int.channel.send({ embeds: [embedError] }).then((msg) => {
                msgIDs.push(msg.id);
              });

              return askQuestion(i, true);
            }
          } else {
            answers.push({
              status: true,
              content: `${response.content}`,
            });
          }

          if (i >= questions.length - 1) final(answers, msgIDs);
          else askQuestion(++i);
        }
      );
    };
    askQuestion(0, true);
  },
};

const Discord = require("discord.js");
const Utils = require("../Modules/Utils.js");
const Guild = require("../database/Models/Guild.js");
const Row = Discord.MessageActionRow;
const Embed = Discord.EmbedBuilder;
const Button = Discord.MessageButton;
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("createcommand")
    .setDescription("Create a command")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command name.")
        .setRequired(true)
    ),
  cooldown: "3s",
  async run(client, interaction, cooldown) {
    /* Cooldown */
    cooldown();

    let int = interaction;

    /* Verificar perms */
    if (interaction.member.id !== "343929946315554816") {
      if (interaction.member.permissions.has("ADMINISTRATOR") === false) return;
    }

    let commandName = int.options.getString("command");
    let command =
      client.comandos.get(commandName.toLowerCase()) ||
      client.comandos.find(
        (cmdi) =>
          cmdi.aliases && cmdi.aliases.includes(commandName.toLowerCase())
      );
    let guild = await Guild.findOne({ guildId: int.guild.id }).exec();
    let dbCommands = guild?.commands ?? [];
    let index = dbCommands.findIndex(
      (c) => c.name.toLowerCase() === commandName.toLowerCase()
    );

    if (command) {
      int.reply({
        content: `The \`${commandName}\` command already exists, please retry the command again with another name.`,
        ephemeral: true,
      });
      return;
    }

    /* Embed */

    let embed = new Embed()
      .setTitle("⚙️ | Setup System")
      .setDescription("`🔄` Please answer the following questions")
      .setColor(client.color);

    await int.reply({
      embeds: [embed],
    });
    let questions = [
      "What is the title of the embed message, if you don't want a title type `no`.",
      "What is the description of the embed message?.",
      "What is the footer of the embed message?, if you don't want a footer type `no`.",
      "What is the footer icon of the embed message (It has to be a URL), if you do not want a footer icon type 'no'.",
      "What is the image of the embed message (It has to be a URL), if you don't want an image type `no`.",
      "What is the thumbnail of the embed message (It has to be a URL), if you don't want a thumbnail type `no`.",
    ];
    let answers = [];
    let msgIDs = [];
    async function waitForResponse(userid, channel) {
      const filtro = (m) => m.author.id == userid;
      return new Promise((resolve, reject) => {
        channel
          .awaitMessages({ filter: filtro, max: 1 })
          .then((msgs) => {
            resolve(msgs.first());
          })
          .catch(reject);
      });
    }

    async function final(answers, msgIDs) {
      let answersUpdate = [];
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
      if (
        answersUpdate[2].status === true &&
        answersUpdate[3].status === true
      ) {
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

      await int.channel
        .send({ content: "Embed Command Preview:", embeds: [embed] })
        .catch(async (err) => {
          await Guild.updateOne(
            { guildId: int.guild.id },
            {
              commands: dbCommands,
            }
          );
          let c = "`";
          let cc = "```";
          let embedERR = new Embed()
            .setDescription(`${c}❌${c} | Error: ${cc}js\n${err}\n${cc}`)
            .setColor(client.color);
          int.channel
            .send({ embeds: [embedERR], ephemeral: true })
            .catch((err) => int.editReply({ embeds: [embedERR] }));
          return;
        });

      dbCommands.push({
        name: commandName,
        message: {
          title: answers[0],
          description: answers[1],
          footer: answers[2],
          footer_icon: answers[3],
          image: answers[4],
          thumbnail: answers[5],
        },
      });
      await Guild.updateOne(
        { guildId: int.guild.id },
        { commands: dbCommands }
      );

      /* Eliminar mensajes */

      await int.deleteReply().catch(async (e) => {});
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
      let texto = "Question: {pos}";
      let embed2 = new Embed()
        .setTitle(texto.replace(/{pos}/g, `${i + 1}/` + questions.length))
        .setDescription(question)
        .setColor(client.color);
      if (ask !== false)
        await int.channel
          .send({ embeds: [embed2] })
          .then((msg) => msgIDs.push(msg.id));

      await waitForResponse(int.user.id, int.channel).then(async (response) => {
        msgIDs.push(response.id);
        if (i === 0) {
          if (
            response.content.toLowerCase() === "no" ||
            response.content.toLowerCase() === "'no'" ||
            response.content.toLowerCase() === '"no"' ||
            response.content.toLowerCase() === "`no`"
          ) {
            answers.push({ status: false, content: `${response.content}` });
          } else {
            answers.push({ status: true, content: `${response.content}` });
          }
        } else if (i === 1) {
          answers.push({ status: true, content: `${response.content}` });
        } else if (i === 2) {
          if (
            response.content.toLowerCase() === "no" ||
            response.content.toLowerCase() === "'no'" ||
            response.content.toLowerCase() === '"no"' ||
            response.content.toLowerCase() === "`no`"
          ) {
            answers.push({ status: false, content: `${response.content}` });
          } else {
            answers.push({ status: true, content: `${response.content}` });
          }
        } else if (i === 3) {
          let expresion =
            /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
          if (
            response.content.toLowerCase() === "no" ||
            response.content.toLowerCase() === "'no'"
          ) {
            answers.push({ status: false, content: `${response.content}` });
          } else if (
            response.content.toLowerCase() === "{user-pfp}" ||
            response.content.toLowerCase() === "{server-pfp}"
          ) {
            answers.push({ status: true, content: `${response.content}` });
          } else if (expresion.test(response.content) === false) {
            await int.channel
              .send({
                embeds: [
                  new Embed()
                    .setTitle("⚠️ | Error")
                    .setDescription(
                      "The footer icon entered is not a URL, remember that it must be a URL."
                    )
                    .setColor("FF0000"),
                ],
              })
              .then(async (m) => {
                setTimeout(async () => {
                  await response.delete();
                  await m.delete();
                }, 3000);
              });
            await askQuestion(i, false);
            return;
          } else {
            answers.push({ status: true, content: `${response.content}` });
          }
        } else if (i === 4) {
          let expresion =
            /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
          if (
            response.content.toLowerCase() === "no" ||
            response.content.toLowerCase() === "'no'"
          ) {
            answers.push({ status: false, content: `${response.content}` });
          } else if (
            response.content.toLowerCase() === "{user-pfp}" ||
            response.content.toLowerCase() === "{server-pfp}"
          ) {
            answers.push({ status: true, content: `${response.content}` });
          } else if (expresion.test(response.content) === false) {
            await int.channel
              .send({
                embeds: [
                  new Embed()
                    .setTitle("⚠️ | Error")
                    .setDescription(
                      "The image entered is not a URL, remember that it must be a URL."
                    )
                    .setColor("FF0000"),
                ],
              })
              .then(async (m) => {
                setTimeout(async () => {
                  await response.delete();
                  await m.delete();
                }, 3000);
              });
            await askQuestion(i, false);
            return;
          } else {
            answers.push({ status: true, content: `${response.content}` });
          }
        } else if (i === 5) {
          let expresion =
            /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
          if (
            response.content.toLowerCase() === "no" ||
            response.content.toLowerCase() === "'no'"
          ) {
            answers.push({ status: false, content: `${response.content}` });
          } else if (
            response.content.toLowerCase() === "{user-pfp}" ||
            response.content.toLowerCase() === "{server-pfp}"
          ) {
            answers.push({ status: true, content: `${response.content}` });
          } else if (expresion.test(response.content) === false) {
            await int.channel
              .send({
                embeds: [
                  new Embed()
                    .setTitle("⚠️ | Error")
                    .setDescription(
                      "The thumbnail entered is not a URL, remember that it must be a URL."
                    )
                    .setColor("FF0000"),
                ],
              })
              .then(async (m) => {
                setTimeout(async () => {
                  await response.delete();
                  await m.delete();
                }, 3000);
              });
            await askQuestion(i, false);
            return;
          } else {
            answers.push({ status: true, content: `${response.content}` });
          }
        } else {
          answers.push(response.content);
        }

        if (i >= questions.length - 1) final(answers, msgIDs);
        else askQuestion(++i);
      });
    };

    askQuestion(0, true);
  },
};

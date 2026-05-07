const Discord = require("discord.js");
const db = require("../../database/Models/Guild.js");
const Utils = require("../../Modules/Utils.js");
const Posts = require("../../database/Models/Posts.js");
const Twitter = require("../../database/Models/Twitter.js");
const cooldowns = new Map();
const Embed = Discord.EmbedBuilder;
const Row = Discord.ActionRowBuilder;
const Button = Discord.ButtonBuilder;
const Data = { config: Utils.config(), messages: Utils.messages() };
const Modal = Discord.Modal;
const Text = Discord.TextInputComponent;
const axios = require("axios");

module.exports = {
  name: "interactionCreate",
  run: async (client, config, interaction) => {
    let bot = client;

    /* Verify Database */
    let data = await Utils.verifyDatabaseGuild(db, client, interaction);
    client.color = data.color;
    client.prefix = data.prefix;
    if (data.log_channel) client.log_channel = data.log_channel;

    /* Slash Commands */
    if (interaction.isCommand()) {
      const slashcmds = client.slashcommands.get(interaction.commandName);

      if (!slashcmds) return;

      /* Formatting Time */

      let time_pattern = /^(\d+((h|H)|(d|D)|(m|M)))+$/;

      const mins = Utils.getTimeElement("m", slashcmds.cooldown);
      const hours = Utils.getTimeElement("h", slashcmds.cooldown);
      const days = Utils.getTimeElement("d", slashcmds.cooldown);

      let total = 0;
      total += mins * 60000;
      total += hours * 60 * 60000;
      total += days * 24 * 60 * 60000;
      total = total / 1000;

      time_pattern.test(slashcmds.cooldown) === true ? "" : (total = 5);

      /* Cooldown */
      function cooldown() {
        if (!cooldowns.has(interaction.commandName)) {
          cooldowns.set(interaction.commandName, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(interaction.commandName);
        const cooldownAmount = total * 1000;

        timestamps.set(interaction.user.id, now);
        setTimeout(
          () => timestamps.delete(interaction.user.id),
          cooldownAmount
        );
      }
      const now = Date.now();
      const timestamps = cooldowns.get(interaction.commandName);
      const cooldownAmount = total * 1000;

      if (timestamps !== undefined) {
        if (timestamps.has(interaction.user.id)) {
          const expirationTime =
            timestamps.get(interaction.user.id) + cooldownAmount;

          if (now < expirationTime) {
            const timeLeft = expirationTime - now;
            return interaction.reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setDescription(
                    `Cooldown ${Utils.timeFormat(
                      Utils.parseMS(timeLeft)
                    )} más antes de usar el comando de nuevo \`${
                      interaction.commandName
                    }\`.`
                  )
                  .setColor(client.color),
              ],
              ephemeral: true,
            });
          }
        }
      }

      await slashcmds.run(client, interaction, cooldown);
    }

    /* Buttons */
    if (interaction.isButton()) {
      let int = interaction;

      /* Comments */
      if (int.customId === "msg") {
        let options = {
          guildId: int.guild.id,
          messageId: int.message.id,
        };
        let data = await Posts.findOne(options);

        if (data) {
          /* Row */
          let button1 = new Button()
            .setCustomId("like")
            .setLabel(`${data.likes.length}`)
            .setEmoji("❤️")
            .setStyle(Discord.ButtonStyle.Primary);
          let button2 = new Button()
            .setCustomId("rt")
            .setLabel(`${data.rts.length}`)
            .setEmoji("🔁")
            .setStyle(Discord.ButtonStyle.Primary);

          let row = new Row().addComponents(button1, button2);

          interaction.update({ components: [row] });

          await Posts.updateOne(options, { msg: true });

          int.message.startThread({
            name: "💬 | Comentarios",
          });
        }
      } else if (int.customId === "like") {
        let options = {
          guildId: int.guild.id,
          messageId: int.message.id,
        };
        let data = await Posts.findOne(options);

        let search = await Twitter.findOne({
          guildId: int.guild.id,
          userId: int.user.id,
        });
        if (!search) {
          return int.reply({
            content:
              "No puedes dar like debido a qué no tienes una cuenta creada\nSi quieres crearte una cuenta usa el comando `/createcommand`",
            ephemeral: true,
          });
        }

        if (data) {
          if (data.likes.find((user) => user === int.user.id)) {
            data.likes = data.likes.filter((user) => user !== int.user.id);
          } else {
            data.likes.push(int.user.id);
          }

          /* Row */
          let button1 = new Button()
            .setCustomId("like")
            .setLabel(`${data.likes.length}`)
            .setEmoji("❤️")
            .setStyle(Discord.ButtonStyle.Primary);
          let button2 = new Button()
            .setCustomId("rt")
            .setLabel(`${data.rts.length}`)
            .setEmoji("🔁")
            .setStyle(Discord.ButtonStyle.Primary);

          let row = new Row().addComponents(button1, button2);

          if (data.msg !== true) {
            let button3 = new Button()
              .setCustomId("msg")
              .setEmoji("💬")
              .setStyle(Discord.ButtonStyle.Primary);
            row = new Row().addComponents(button1, button2, button3);
          }

          interaction.update({ components: [row] });
          await Posts.updateOne(options, { likes: data.likes });
        }
      } else if (int.customId === "rt") {
        let options = {
          guildId: int.guild.id,
          messageId: int.message.id,
        };
        let options_2 = {
          guildId: int.guild.id,
          userId: int.user.id,
        };
        let data = await Posts.findOne(options);
        let user = await Twitter.findOne(options_2);

        if (data.rts.find((i) => i.userId === int.user.id) !== undefined) {
          return int.reply({
            content: "Ya has dado **retweet** a esta publicación",
            ephemeral: true,
          });
        } else if (data.userId === int.user.id) {
          return int.reply({
            content: "No puedes dar retweet a tu propia publicación",
            ephemeral: true,
          });
        }

        await int.guild.channels.cache
          .get(int.channel.id)
          .messages.fetch(data.messageId)
          .then(async (msg) => {
            let embed = new Embed()
              .setAuthor({
                name: `Nuevo Retweet`,
                iconURL:
                  "https://media.discordapp.net/attachments/1152106610810957824/1173760039991918712/twitter.png?ex=65652038&is=6552ab38&hm=239a8ec01aae5ed9416902a378cbf8c1af78198055cc798d2f70881aaff88990&=",
              })
              .setDescription(
                `👤 El usuario <@${int.user.id}>\n🔁 ha retweeteado a <@${data.userId}>\n📄 Su publicación: https://discord.com/channels/${int.guild.id}/${int.channel.id}/${data.messageId}\n\n${data.post}`
              )
              .setColor(client.color);

            let channel = await int.guild.channels.cache.get(user.channelId);
            if ((msg?.embeds[0]?.image?.url ?? undefined) !== undefined) {
              embed.setImage(msg.embeds[0].image.url);
              channel.send({ embeds: [embed] });
              await Twitter.updateOne(options_2, {
                $push: {
                  replies: {
                    guildId: int.guild.id,
                    messageId: int.message.id,
                    channelId: int.channel.id,
                  },
                },
              });
              await Posts.updateOne(options, {
                $push: {
                  rts: {
                    guildId: int.guild.id,
                    userId: int.user.id,
                    messageId: int.message.id,
                    channelId: int.channel.id,
                  },
                },
              });
            } else {
              let attachments = [];
              msg.attachments.forEach(async (i, index) => {
                let response = await axios.get(i.url, {
                  responseType: "arraybuffer",
                });

                let buffer = Buffer.from(response.data, "utf-8");
                let attachment = new Discord.AttachmentBuilder(buffer, {
                  name: `${i.name}`,
                });
                attachments.push(attachment);

                function sleep(milliseconds) {
                  let start = new Date().getTime();
                  for (let i = 0; i < 1e7; i++) {
                    if (new Date().getTime() - start > milliseconds) {
                      break;
                    }
                  }
                }
                sleep(400);

                if (attachments.length === msg.attachments.size) {
                  await Twitter.updateOne(options_2, {
                    $push: {
                      replies: {
                        guildId: int.guild.id,
                        messageId: int.message.id,
                        channelId: int.channel.id,
                      },
                    },
                  });
                  await Posts.updateOne(options, {
                    $push: {
                      rts: {
                        guildId: int.guild.id,
                        userId: int.user.id,
                        messageId: int.message.id,
                        channelId: int.channel.id,
                      },
                    },
                  });
                  channel.send({ embeds: [embed], files: attachments });
                }
              });
            }
          });

        /* Row */
        let button1 = new Button()
          .setCustomId("like")
          .setLabel(`${data.likes.length}`)
          .setEmoji("❤️")
          .setStyle(Discord.ButtonStyle.Primary);
        let button2 = new Button()
          .setCustomId("rt")
          .setLabel(`${data.rts.length + 1}`)
          .setEmoji("🔁")
          .setStyle(Discord.ButtonStyle.Primary);

        let row = new Row().addComponents(button1, button2);

        if (data.msg !== true) {
          let button3 = new Button()
            .setCustomId("msg")
            .setEmoji("💬")
            .setStyle(Discord.ButtonStyle.Primary);
          row = new Row().addComponents(button1, button2, button3);
        }

        interaction.update({ components: [row] });
      }
    }
  },
};

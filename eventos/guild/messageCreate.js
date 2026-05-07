const Discord = require("discord.js");
const os = require("os");
const Utils = require("../../Modules/Utils.js");
const config = Utils.config();
const db = require("../../database/Models/Guild.js");
const Twitter = require("../../database/Models/Twitter.js");
const Posts = require("../../database/Models/Posts.js");
const internal = require("stream");
const Guild = db;
const Embed = Discord.EmbedBuilder;
const Row = Discord.ActionRowBuilder;
const Button = Discord.ButtonBuilder;
const cooldowns = new Map();
const axios = require("axios");

module.exports = {
  name: "messageCreate",
  run: async (client, config, message) => {
    if (message.author.bot) return;

    /* Verify Database */

    let data = await Utils.verifyDatabaseGuild(db, client, message);
    client.color = data.color;
    client.prefix = data.prefix;
    if (data.log_channel) client.log_channel = data.log_channel;

    /* Posts */

    let search = await Twitter.findOne({
      guildId: message.guild.id,
      userId: message.author.id,
      channelId: message.channel.id,
    });

    if (search) {
      /* Row */
      let button1 = new Button()
        .setCustomId("like")
        .setLabel("1")
        .setEmoji("❤️")
        .setStyle(Discord.ButtonStyle.Primary);
      let button2 = new Button()
        .setCustomId("rt")
        .setLabel("1")
        .setEmoji("🔁")
        .setStyle(Discord.ButtonStyle.Primary);
      let button3 = new Button()
        .setCustomId("msg")
        .setEmoji("💬")
        .setStyle(Discord.ButtonStyle.Primary);

      let row = new Row().addComponents(button1, button2, button3);

      let embed = new Embed()
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL({
            dynamic: true,
            size: 1024,
          }),
        })
        .setFooter({
          text: message.guild.name,
          iconURL: message.guild.iconURL({
            dynamic: true,
            size: 1024,
          }),
        })
        .setColor(client.color);

      if (message.content) embed.setDescription(message.content);

      let data = message.attachments;
      let attachment;
      let attachments = [];
      console.log(data.size);
      if (data.size === 1) {
        data.forEach(async (i, index) => {
          await axios
            .get(i.url, {
              responseType: "arraybuffer",
            })
            .then(async (response) => {
              /* Buffer */
              let buffer = Buffer.from(response.data, "utf-8");
              attachment = new Discord.AttachmentBuilder(buffer, {
                name: `${i.name}`,
              });
              embed.setImage(`attachment://${i.name}`);
              attachments.push(attachment);

              /* Post */

              message.channel
                .send({
                  embeds: [embed],
                  components: [row],
                  files: attachments,
                })
                .then(async (msg) => {
                  await Posts.create({
                    guildId: message.guild.id,
                    userId: message.author.id,
                    messageId: msg.id,
                    post: message.content,
                    date: `${`${new Date() / 1000}`.split(".")[0]}`,
                    likes: [client.user.id],
                    rts: [
                      { guildId: message.guild.id, userId: client.user.id },
                    ],
                  });
                });
            });
        });
      } else if (data.size >= 2) {
        data.forEach(async (i, index) => {
          let response = await axios.get(i.url, {
            responseType: "arraybuffer",
          });
          let buffer = Buffer.from(response.data, "utf-8");
          let attachment = new Discord.AttachmentBuilder(buffer, {
            name: `${i.name}`,
          });
          attachments.push(attachment);
          /* Stop code */
          function sleep(milliseconds) {
            let start = new Date().getTime();
            for (let i = 0; i < 1e7; i++) {
              if (new Date().getTime() - start > milliseconds) {
                break;
              }
            }
          }
          sleep(700);
          if (attachments.length === data.size) {
            /* Post */

            message.channel
              .send({ embeds: [embed], components: [row], files: attachments })
              .then(async (msg) => {
                await Posts.create({
                  guildId: message.guild.id,
                  userId: message.author.id,
                  messageId: msg.id,
                  msg: false,
                  post: message.content,
                  date: `${`${new Date() / 1000}`.split(".")[0]}`,
                  likes: [client.user.id],
                  rts: [{ guildId: message.guild.id, userId: client.user.id }],
                });
              });
          }
        });

        await message.delete();
        return;
      }
      console.log(embed);
      if (data.size === 0) {
        message.channel
          .send({ embeds: [embed], components: [row] })
          .then(async (msg) => {
            await Posts.create({
              guildId: message.guild.id,
              userId: message.author.id,
              messageId: msg.id,
              post: message.content,
              date: `${`${new Date() / 1000}`.split(".")[0]}`,
              likes: [client.user.id],
              rts: [client.user.id],
            });
          });
      }
      await message.delete();
    }

    /* Commands */

    if (!message.content.startsWith(client.prefix)) return;
    if (message.content === client.prefix) return;

    const args = message.content
      .slice(client.prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();

    let dbCommands = data?.commands ?? [];
    if (dbCommands.length > 0) {
      let pull = require(`../../Modules/CreateCommands.js`);
      pull.type = "databaseCommand";
      dbCommands.forEach((i, index) => {
        pull.message = i.message;
        client.comandos.set(i.name, pull);
      });
    }
    let comando =
      client.comandos.get(cmd) ||
      client.comandos.find(
        (cmdi) => cmdi.aliases && cmdi.aliases.includes(cmd)
      );

    if (!comando) {
      /* Comando no encontrado */
      let comandos = client.comandos.map((i) => i.name.replace(".js"));
      let result = Utils.findBestMatch(cmd.toLowerCase(), comandos).bestMatch
        .target;
      let arr = [];
      comandos.forEach((c) => {
        let arg = cmd.toLowerCase();
        if (
          c
            .charAt(0)
            .startsWith(arg.charAt(0) + arg.charAt(1) || arg.charAt(0)) === true
        ) {
          arr.push(c);
        }
      });
      let embed = new Discord.EmbedBuilder()
        .setDescription(
          `❌` +
            ` | The "**${cmd}**" command does not exist.\n¿Did you mean **${
              arr.length >= 1 ? arr[0] : result
            }**?\nIf it is the command you are looking for, react with ✅ to execute the command\nIf not, use \`/help\` to see the list of commands.`
        )
        .setColor(client.color);
      let enviar = await message.channel.send({ embeds: [embed] });
      enviar.react("✅");
      const filter = (reaction, user) => {
        return reaction.emoji.name === "✅" && user.id === message.author.id;
      };
      try {
        const collector = enviar.createReactionCollector({
          filter,
          time: 30000,
        });
        collector.on("collect", async (reaction, user) => {
          let commandExecute = `${arr.length >= 1 ? arr[0] : result}`;

          /* Cooldown */

          if (!cooldowns.has(commandExecute)) {
            cooldowns.set(commandExecute, new Discord.Collection());
          }
          const current_time = Date.now();
          const time_stamps = cooldowns.get(commandExecute);
          const cooldown_amount = commandExecute * 1000;

          if (time_stamps.has(message.author.id)) {
            const expiration_time =
              time_stamps.get(message.author.id) + cooldown_amount;

            if (current_time < expiration_time) {
              const time_left = (expiration_time - current_time) / 1000;

              return message.reply(
                `Cooldown ${time_left.toFiex[1]} before using the command again \`${cmd}\``
              );
            }
          }

          let embedEdit = new Discord.EmbedBuilder()
            .setDescription(`Command **${commandExecute}** executed.`)
            .setColor(client.color);
          await enviar.edit({ embeds: [embedEdit] });
          client.comandos.get(commandExecute).run(client, message, args);
        });

        collector.on("end", async (i) => {
          if (i.size <= 0) {
            embed = new Discord.EmbedBuilder()
              .setDescription("`⏰` | Time Exceeded")
              .setColor(client.color);
            await enviar.edit({ embeds: [embed] });
            await enviar.reactions.removeAll();
          }
        });
      } catch (e) {
        Utils.logError(e.message);
      }
    } else {
      let command = comando;
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 3) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.channel
            .send({
              embeds: [
                new Discord.EmbedBuilder()
                  .setDescription(
                    `Cooldown ${
                      timeLeft < 1
                        ? `**${timeLeft.toFixed(1)}**`
                        : `${timeLeft.toFixed()}`
                    } ${
                      timeLeft === 1 ? "segundo" : "segundos"
                    } más antes de usar el comando de nuevo \`${
                      command.name
                    }\`.`
                  )
                  .setColor(client.color),
              ],
            })
            .then((result) => {
              setTimeout(async () => {
                result.delete();
              }, 10000);
            });
        }
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      if (comando?.type ?? null === "databaseCommand") {
        comando.run(client, message, args, data, comando);
      } else comando.run(client, message, args);
    }
  },
};

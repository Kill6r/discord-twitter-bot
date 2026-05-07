const Discord = require("discord.js");
const moment = require("moment");
const Guild = require("../database/Models/Guild.js");
const fs = require("fs");
const Utils = require("../Modules/Utils.js");
const hastebin = require("hastebin-gen");
const Row = Discord.MessageActionRow;
const Embed = Discord.MessageEmbed;
const Button = Discord.MessageButton;
const Modal = Discord.Modal;
const Text = Discord.TextInputComponent;
const chalk = require("chalk");
const stringSimilarity = require("string-similarity");

module.exports = {
  Captcha: () => {
    /* Test */
    function Captcha() {
      console.log(".");
      let chars = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
      ];
      let shuffle = (arr) => {
        let i = arr.length;
        while (i) {
          let j = Math.floor(Math.random() * i--);
          [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        return arr;
      };
      let randomText = shuffle(chars);
      let length = 6;
      let colors = ["#726bb3", "#6d7098", "#365a6e"];

      let canvas = Canvas.createCanvas(400, 250);
      let ctx = canvas.getContext("2d");

      // Set background color
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#7289da";
      ctx.beginPath();
      ctx.fillRect(0, 0, 400, 250);
      ctx.save();

      // generate text
      let text = "";
      for (let i = 0; i < length; i++)
        text += chars[Math.floor(Math.random() * chars.length)];

      // Set style for text based on length param
      ctx.font = `${length > 6 ? 80 / (length / 7.5) : 80}px Testinggg`;
      ctx.fillStyle = "#000";

      // Set position for text
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // Set text value and print it to canvas
      ctx.beginPath();
      ctx.fillText(text, 200, 90);

      console.log(text);

      fs.writeFileSync("./image.png", canvas.toBuffer(), function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Archivo Guardado");
      });
    }
    Captcha();
  },
  getRandom: (array) => {
    let random = Math.floor(Math.random() * array.length);
    return array[random];
  },
  logInfo: (text) => {
    console.log(chalk.hex("#57ff6b").bold("[INFO] ") + text);
  },
  logWarning: (text) => {
    console.log(chalk.hex("#edd100").bold("[WARN] ") + text);
  },
  logError: (text) => {
    console.log(chalk.hex("#ff0800").bold("[ERROR] ") + text);
  },
  primeraLetra: (text) => {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
  },
  findChannel: (name, guild, type = "GUILD_TEXT", notify = true) => {
    if (!name)
      return module.exports.logError(
        `[Utils] [findChannel] Invalid input for channel ${chalk.bold(name)}.`
      );
    if (!guild)
      return module.exports.logError(
        `[Utils] [findChannel] Invalid input for ${chalk.bold("guild")}.`
      );
    let channel = guild.channels.cache.find(
      (c) =>
        (c.name.toLowerCase() == name.toLowerCase() || c.id == name) &&
        c.type.toLowerCase() == type.toLowerCase()
    );
    if (channel) {
      return channel;
    } else {
      if (notify) {
        module.exports.logError(
          `[Utils] [findChannel] ${chalk.bold(
            "name"
          )} was not found in the ${chalk.bold(guild.name)} guild`
        );
      }
      return false;
    }
  },
  findRole: (name, guild, notify = true) => {
    if (!name)
      return module.exports.logError(
        `[Utils] [findRole] Invalid input for role name.`
      );
    if (!guild)
      return module.exports.logError(
        `[Utils] [findRole] Invalid input for guild.`
      );
    let role = guild.roles.cache.find(
      (r) => r.name.toLowerCase() == name.toLowerCase() || r.id == name
    );
    if (role) {
      return role;
    } else {
      if (notify) {
        module.exports.logError(
          `[Utils] [findRole] ${chalk.bold(
            name
          )} role was not found in ${chalk.bold(guild.name)} guild`
        );
      }
      return false;
    }
  },
  hasRole: (member, name, notify = true) => {
    if (!member)
      return module.exports.logError(
        `[Utils] [hasRole] Invalid input for ${chalk.bold("member")}.`
      );
    if (!name)
      return module.exports.logError(
        `[Utils] [hasRole] Invalid input for role ${chalk.bold("name")}.`
      );
    let permissions = [];
    if (Array.isArray(name) && name[0]) {
      for (let index = 0; index < name.length; index++) {
        const roleName = name[index];
        let role = module.exports.findRole(roleName, member.guild, notify);
        if (role) {
          if (member.roles.cache.has(role.id)) {
            permissions.push(true);
          } else {
            permissions.push(false);
          }
        } else {
          permissions.push(false);
        }
      }
    } else if (typeof name == "string") {
      let role = module.exports.findRole(name, member.guild, notify);
      if (role) {
        if (member.roles.cache.has(role.id)) {
          permissions.push(true);
        } else {
          permissions.push(false);
        }
      } else {
        permissions.push(false);
      }
    } else {
      module.exports.logError(
        `[Utils] [hasRole] Invalid type of ${chalk.bold("name")} property.`
      );
    }

    if (permissions.includes(true)) {
      return true;
    } else {
      return false;
    }
  },
  getUserBadges: (member) => {
    if (!member)
      return module.exports.logError(
        `[Utils] [getUserBadges] Invalid input ${chalk.bold("member")}.`
      );
    let badges = {
        BUGHUNTER_LEVEL_1: "Discord Bug Hunter Level 1",
        BUGHUNTER_LEVEL_2: "Discord Bug Hunter Level 2",
        DISCORD_EMPLOYEE: "Discord Staff",
        DISCORD_NITRO: "Discord Nitro",
        EARLY_SUPPORTER: "Early Supporter",
        HOUSE_BALANCE: "HypeSquad Balance",
        HOUSE_BRAVERY: "HypeSquad Bravery",
        HOUSE_BRILLIANCE: "HypeSquad Brilliance",
        HYPESQUAD_EVENTS: "HypeSquad Events",
        EARLY_VERIFIED_BOT_DEVELOPER: "Early Verified Bot Developer",
        PARTNERED_SERVER_OWNER: "Partnered Server Owner",
        DISCORD_CERTIFIED_MODERATOR: "Discord Certified Moderator",
        VERIFIED_BOT: "Verified Bot",
        TEAM_USER: "Team User",
      },
      data = [],
      flags = member.user.flags.toArray();
    flags.forEach((flag, i) => {
      if (badges[flag]) {
        data.push(badges[flag]);
      }
    });
    return data;
  },
  getChannel: (channel = null, guild) => {
    if (typeof channel === "string") {
      const ch = guild.channels.cache.find((rl) =>
        [rl.name.toLowerCase(), rl.id].includes(channel.toLowerCase())
      );
      if (ch) {
        return ch;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  },
  findChannel: async (id, guild) => {
    let channel = await guild.channels.cache.find((c) => c.id == id);
    if (!channel) {
      channel = await guild.channels.cache.find((c) => c.name == id);
    }
    return channel;
  },
  questions: async (
    client,
    user,
    channel,
    questions,
    deleteMessages,
    finalmente
  ) => {
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
    let canal = client.channels.cache.get(channel.id);
    const askQuestion = async (i, ask = true) => {
      const question = questions[i];
      let texto = "Question: {pos}";
      let embed2 = new Discord.MessageEmbed()
        .setTitle(texto.replace(/{pos}/g, `${i + 1}/` + questions.length))
        .setDescription(question)
        .setColor(client.color || "#A64D79");
      if (ask)
        await channel
          .send({ embeds: [embed2] })
          .then((msg) => msgIDs.push(msg.id));

      await waitForResponse(user.id, canal).then((response) => {
        msgIDs.push(response.id);
        if (i == 0) {
          answers.push(response.content);
        } else answers.push(response.content);

        if (i >= questions.length - 1) finalmente(answers, canal, msgIDs);
        else askQuestion(++i);
      });
    };

    askQuestion(0);
  },
  findBestMatch: (string, array) => {
    let matches = stringSimilarity.findBestMatch(string, array);
    return matches;
  },
  compareTwoStrings: (string1, string2) => {
    let matches = stringSimilarity.compareTwoStrings(string1, string2);
    return matches;
  },
  waitForResponse: function (userid, channel) {
    const filtro = (m) => m.author.id == userid;
    return new Promise((resolve, reject) => {
      channel
        .awaitMessages({ filter: filtro, max: 1 })
        .then((msgs) => {
          resolve(msgs.first());
        })
        .catch(reject);
    });
  },
  verifyDatabaseGuild: async (db, client, message) => {
    let data = await db.findOne({ guildId: message.guild.id }).exec();
    if (!data || data === null) {
      await db.create({
        guildId: message.guild.id,
        prefix: "-",
        color: "#00C7FF",
      });
      data = await db.findOne({ guildId: message.guild.id }).exec();
      client.prefix = data.prefix;
      client.color = data.color;
    } else {
      data = await db.findOne({ guildId: message.guild.id }).exec();
      client.prefix = data.prefix;
      client.color = data.color;
    }
    return data;
  },
  generateCode: (limite) => {
    let token = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
    let code = "";
    for (let i = 0; i < limite; i++) {
      code += token.charAt(Math.floor(Math.random() * token.length));
    }
    return code;
  },
  getTimeElement: (letter, cadena) => {
    if (typeof cadena !== "string") return;
    const find = `${cadena}`.toLowerCase().match(new RegExp(`\\d+${letter}`));
    return parseInt(find ? find[0] : 0);
  },
  parseMS: (milliseconds) => {
    if (typeof milliseconds !== "number") {
      throw new TypeError("Expected a number");
    }

    return {
      days: Math.trunc(milliseconds / 86400000),
      hours: Math.trunc(milliseconds / 3600000) % 24,
      minutes: Math.trunc(milliseconds / 60000) % 60,
      seconds: Math.trunc(milliseconds / 1000) % 60,
      milliseconds: Math.trunc(milliseconds) % 1000,
      microseconds: Math.trunc(milliseconds * 1000) % 1000,
      nanoseconds: Math.trunc(milliseconds * 1e6) % 1000,
    };
  },
  timeFormat: (obj) => {
    function formatTextOfTime(time, format) {
      let texto = `${
        time === 1 ? `${format.charAt(0)} ` : `${format.charAt(0)} `
      }`;
      return texto;
    }
    let days = `${
      obj.days === 0 ? "" : `${obj.days}${formatTextOfTime(obj.days, "day")} `
    }`;
    let hours = `${
      obj.hours === 0
        ? ""
        : `${obj.hours}${formatTextOfTime(obj.hours, "hour")} `
    }`;
    let minutes = `${
      obj.minutes === 0
        ? ""
        : `${obj.minutes}${formatTextOfTime(obj.minutes, "minute")} `
    }`;
    let seconds = `${
      obj.seconds === 0
        ? ""
        : `${obj.seconds}${formatTextOfTime(obj.seconds, "second")} `
    }`;
    let tiempo = `${days}${hours}${minutes}${seconds}`;
    return tiempo;
  },
  convertToEmojis: (number) => {
    let emojis = [
      "0️⃣",
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
    ];
    if (typeof number !== "number")
      return module.exports.logError(number + " no es tipo un numero");
    let newNumber = String(number);
    for (let i = 0; i < emojis.length; i++) {
      newNumber = newNumber.replaceAll(i, emojis[i]);
    }
    return newNumber;
  },
  verifyDatabaseEvent: async (db, client, guild) => {
    let data;
    if ((await db.exists({ guildId: guild.id })) === false) {
      await db.create({
        guildId: guild.id,
        prefix: "-",
        color: "#00C7FF",
      });
      data = await db.findOne({ guildId: guild.id }).exec();
      client.prefix = data.prefix;
      client.color = data.color;
    } else {
      data = await db.findOne({ guildId: guild.id }).exec();
      client.prefix = data.prefix;
      client.color = data.color;
    }
    return data;
  },
  findOne: (map, search) => {
    /* Check if search is an object */
    if (typeof search !== "object")
      return module.exports.logError(
        `\x1b[33m[WARNING] \x1b[0mThe information obtained is not an object.`
      );

    let data = null;
    map.forEach((value, key) => {
      let found = map.get(key);
      Object.keys(search).forEach((value) => {
        if (found[key] === search[value]) {
          data = found;
        }
      });
    });
    if (data === null)
      return module.exports.logError(
        `\x1b[33m[WARNING] \x1b[0mThe database does not contain the requested information.`
      );
    return data;
  },
  findMatch: (map, search) => {
    /* Check if search is an string */
    if (typeof search !== "string")
      return module.exports.logError(
        `\x1b[33m[WARNING] \x1b[0mThe information obtained is not an string.`
      );

    let data = null;
    map.forEach((value, key) => {
      key.split("_").forEach((i) => {
        if (i === search) {
          data = {
            id: key,
            data: value,
          };
        }
      });
    });
    if (data === null)
      return module.exports.logError(
        `\x1b[33m[WARNING] \x1b[0mThe database does not contain the requested information.`
      );
    return data;
  },
  config: () => {
    let YAML = require("yaml");
    let fs = require("fs");
    let data = YAML.parse(fs.readFileSync("./configs/config.yml", "utf8"));
    return data;
  },
  messages: () => {
    let YAML = require("yaml");
    let fs = require("fs");
    let data = YAML.parse(fs.readFileSync("./configs/messages.yml", "utf8"));
    return data;
  },
  tempRoleEvent: async (client) => {
    let datos = await Role.find().exec();
    datos.forEach(async (i, index) => {
      let time = Number(i.time);
      /*             let tiempoFaltante = new Date() / 1000 - time;
                    if (tiempoFaltante <= 86400) {
                        if (i.message !== true) {
                            let guild = await client.guilds.resolve(i.guildId)
                            let roleName = await guild.roles.resolve(i.role).name;
                            let embed = new Embed()
                                .setTitle('Role System')
                                .setDescription(`Tú rol **${roleName}** va a expirar pronto...`)
                                .setColor(await Guild.findOne({ guildId: i.guildId }).color || 'GREEN');
                            await guild.members.resolve(i.user).send({ embeds: [embed] })
                            await Role.updateOne({
                                guildId: i.guildId,
                                user: i.user,
                                role: i.role,
                                time: i.time,
                                message: true
                            })
                        }
                    } */
      if (new Date() / 1000 >= time) {
        let g = await Guild.findOne({ guildId: i.guildId });
        let guild = await client.guilds.resolve(i.guildId);
        let role = await guild.roles.resolve(i.role);
        await guild.members.resolve(i.user).roles.remove(role);

        let c = "`";
        let cc = "``";

        /* Log User */

        let roleName = await guild.roles.resolve(i.role).name;
        let embed = new Embed()
          .setTitle("Trial System")
          .setDescription(`You role **${roleName}** has expired.`)
          .setColor(
            (await Guild.findOne({ guildId: i.guildId }).color) || "GREEN"
          );
        await guild.members.resolve(i.user).send({ embeds: [embed] });

        /* Log */

        embed = new Embed()
          .setTitle("Trial System")
          .setDescription(
            `${c}✅${c} | The <@&${i.role}> role of <@${i.user}> has expired.`
          )
          .setColor(
            (await Guild.findOne({ guildId: guild.id }).color) || "GREEN"
          );
        await client.channels.resolve(g.log_channel).send({ embeds: [embed] });
        await Role.deleteOne({
          guildId: i.guildId,
          user: i.user,
          role: i.role,
          time: i.time,
        });
      }
    });
  },
};

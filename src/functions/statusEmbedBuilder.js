const
  { EmbedBuilder } = require("discord.js"),
  error = require("./error"),
  os = require("os"),
  data = require("../storage/embed");
  
/**
 *
 * @param {import("discord.js").Client} client
 * @returns {import("discord.js").EmbedBuilder}
 */
module.exports = async function (client) {
  try {
    return new EmbedBuilder()
      .setColor(data.color.theme)
      .setTitle("Bot Status")
      .addFields(
        [
          {
            name: `${data.emotes.default.server}| Total Guilds:`,
            value: `**\`${client.guilds.cache.size.toLocaleString()}\` Servers**`,
            inline: false
          },
          {
            name: `${data.emotes.default.users}| Total Users:`,
            value: `**\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\` Users**`,
            inline: false
          },
          {
            name: `${data.emotes.default.commands}| Commands:`,
            value: `**slashCommands[\`${client.commands.filter(a => a.only_slash).size}\`] & messageCommands[\`${client.commands.filter(a => a.only_message).size}\`]**`,
            inline: false
          },
          {
            name: `${data.emotes.default.heartbeat}| Heart Beat:`,
            value: `**\`${Math.round(client.ws.ping)}\` ms**`,
            inline: false
          },
          {
            name: `${data.emotes.default.uptime}| Uptime:`,
            value: `**<t:${Math.round(client.readyTimestamp / 1000)}:D> | <t:${Math.round(client.readyTimestamp / 1000)}:R>**`,
            inline: false
          },
          {
            name: `${data.emotes.default.memory}| Memory:`,
            value: `**${Math.round(((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)).toLocaleString()}/${Math.round(((os.totalmem()) / 1024 / 1024).toFixed(2)).toLocaleString()} MB | \`${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%\`**`,
            inline: false
          },
          {
            name: `${data.emotes.default.cpu}| CPU:`,
            value: `**${os.cpus().map((i) => `${i.model}`)[0]} | \`${String(os.loadavg()[0])}%\`**`,
            inline: false
          },
          {
            name: `${data.emotes.default.version}| Bot Version:`,
            value: `**Source \`v${require("../../package.json").version}\` | Discord.js \`v${require(`discord.js`).version}\`**`,
            inline: false
          }
        ]
      ).toJSON();
  } catch (e) {
    error(e);
  }
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */

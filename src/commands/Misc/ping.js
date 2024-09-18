const
  {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType
  } = require("discord.js"),
  os = require("os"),
  response = require("../../functions/response"),
  error = require("../../functions/error"),
  editResponse = require("../../functions/editResponse"),
  embed = require("../../storage/embed");

module.exports = {
  name: "ping",
  description: "پینگ بات",
  category: "misc",
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  user_permissions: ["SendMessages"],
  bot_permissions: ["SendMessages", "EmbedLinks"],
  dm_permissions: false,
  only_owner: false,
  only_slash: true,
  only_message: true,
  options: [
    {
      name: "ephemeral",
      description: "آیا این پیغام پنهان باشد؟",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "بله",
          value: "true"
        },
        {
          name: "خیر",
          value: "false"
        }
      ],
      required: false
    }
  ],

  /**
   * 
   * @param {import("discord.js").Client} client 
   * @param {import("discord.js").CommandInteraction} interaction 
   * @param {Array} args 
   * @returns 
   */
  run: async (client, interaction, args) => {
    const embed1 = new EmbedBuilder()
      .setColor(embed.color.theme)
      .setDescription("Pinging...");

    const message = await response(interaction, { ephemeral: true, embeds: [embed1] }).catch(error);

    const embed2 = new EmbedBuilder()
      .setColor(embed.color.theme)
      .setTitle(`${embed.emotes.default.ping} Pong!`)
      .setFields(
        [
          {
            name: `${embed.emotes.default.server}| Pinging:`,
            value: `**${embed.emotes.default.heartbeat}| Heart Beat: \`${Math.round(client.ws.ping)}\` ms**`,
            inline: true
          },
          {
            name: `\u200b`,
            value: `**${embed.emotes.default.timer}| Time Taken: \`${Date.now() - interaction.createdTimestamp}\` ms**`,
            inline: true
          },
          {
            name: `\u200b`,
            value: `**${embed.emotes.default.uptime}| Uptime: <t:${Math.round(client.readyTimestamp / 1000)}:D> | <t:${Math.round(client.readyTimestamp / 1000)}:R>**`,
            inline: true
          },
          {
            name: `${embed.emotes.default.memory}| Memory:`,
            value: `${embed.emotes.default.reply} **${Math.round(((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)).toLocaleString()}/${Math.round(((os.totalmem()) / 1024 / 1024).toFixed(2)).toLocaleString()} MB | \`${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%\`**`
          }
        ]
      )
      .setTimestamp();

    return await editResponse({ interaction, message, data: { embeds: [embed2] } });
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
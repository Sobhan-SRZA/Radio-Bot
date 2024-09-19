
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
  config = require("../../../config"),
  embed = require("../../storage/embed"),
  selectLanguage = require("../../functions/selectLanguage"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  defaultLanguage = selectLanguage(config.source.default_language).commands.ping;
;

module.exports = {
  name: "ping",
  description: defaultLanguage.description,
  category: "misc",
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  defaultMemberPermissions: ["SendMessages"],
  bot_permissions: ["SendMessages", "EmbedLinks"],
  dmPermission: false,
  nsfw: false,
  only_owner: false,
  only_slash: true,
  only_message: true,
  options: [
    {
      name: "ephemeral",
      description: ephemeral.description,
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: ephemeral.choices.yes,
          value: "true"
        },
        {
          name: ephemeral.choices.no,
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
    const
      db = client.db,
      databaseNames = {
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).commands.ping,
      embed1 = new EmbedBuilder()
        .setColor(embed.color.theme)
        .setDescription(language.replies.pinging),

      message = await response(interaction, { ephemeral: true, embeds: [embed1] }).catch(error),

      embed2 = new EmbedBuilder()
        .setColor(embed.color.theme)
        .setTitle(`${embed.emotes.default.ping} ${language.replies.ping}`)
        .setFields(
          [
            {
              name: `${embed.emotes.default.server}| ${language.replies.fields.pinging}`,
              value: `**${embed.emotes.default.heartbeat}| ${language.replies.values.pinging} \`${Math.round(client.ws.ping)}\` ms**`,
              inline: true
            },
            {
              name: `\u200b`,
              value: `**${embed.emotes.default.timer}| ${language.replies.fields.time} \`${Date.now() - interaction.createdTimestamp}\` ms**`,
              inline: true
            },
            {
              name: `\u200b`,
              value: `**${embed.emotes.default.uptime}| ${language.replies.fields.uptime} <t:${Math.round(client.readyTimestamp / 1000)}:D> | <t:${Math.round(client.readyTimestamp / 1000)}:R>**`,
              inline: true
            },
            {
              name: `${embed.emotes.default.memory}| ${language.replies.fields.پemory}`,
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
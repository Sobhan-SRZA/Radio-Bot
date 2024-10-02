const
  {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
  } = require("discord.js"),
  response = require("../../functions/response"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  defaultLanguage = selectLanguage(config.source.default_language).commands.about,
  statusEmbedBuilder = require("../../functions/statusEmbedBuilder"),
  embed = require("../../storage/embed");

module.exports = {
  name: "about",
  description: defaultLanguage.description,
  category: "misc",
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  default_member_permissions: [PermissionFlagsBits.SendMessages],
  default_permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
  dm_permission: false,
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
   * @returns {void}
   */
  run: async (client, interaction, args) => {
    const
      db = client.db,
      databaseNames = {
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang),
      embeds = [
        EmbedBuilder.from(await statusEmbedBuilder(client, language))
      ],

      components = [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setEmoji(embed.emotes.default.update)
              .setCustomId("botUpdates")
              .setLabel(language.replies.buttons.update)
              .setStyle(ButtonStyle.Primary)
          )
      ];

    return await response(interaction, {
      embeds,
      components
    });
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
const
  {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
  } = require("discord.js"),
  response = require("../../functions/response"),
  config = require("../../../config"),
  embed = require("../../storage/embed"),
  selectLanguage = require("../../functions/selectLanguage"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  defaultLanguage = selectLanguage(config.source.default_language).commands.report;

module.exports = {
  name: "report",
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
      language = selectLanguage(lang);

    if (interaction.user) {
      const modal = new ModalBuilder()
        .setTitle(language.replies.modals.reportModalTitle)
        .setCustomId("reportModal")
        .addComponents(
          new ActionRowBuilder()
            .addComponents(
              new TextInputBuilder()
                .setCustomId("reportModalMessage")
                .setLabel(language.replies.modals.reportModalLabel)
                .setPlaceholder(language.replies.modals.reportModalPlaceholder)
                .setStyle(TextInputStyle.Paragraph)
            )
        );

      return await interaction.showModal(modal);
    }
    else {
      return await response(interaction, {
        content: " ",
        components: [
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(embed.emotes.default.report)
                .setLabel(language.commands.report.replies.reportButton)
                .setCustomId("reportButton")
            )
        ]
      })
    }
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
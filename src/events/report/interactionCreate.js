const createORgetInvite = require("../../functions/createORgetInvite");

const
  {
    EmbedBuilder,
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder,
    ActionRowBuilder,
    WebhookClient,
    ChannelType
  } = require("discord.js"),
  error = require("../../functions/error"),
  selectLanguage = require("../../functions/selectLanguage"),
  copyRight = require("../../storage/embed"),
  config = require("../../../config"),
  defaultLanguage = selectLanguage(config.source.default_language),
  database = require("../../functions/database"),
  replaceValues = require("../../functions/replaceValues");


/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Interaction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    const
      db = new database(client.db),
      databaseNames = {
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang);

    if (interaction.isButton()) {
      if (interaction.customId === "reportButton") {
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
      };

    }

    else if (interaction.isModalSubmit()) {
      if (interaction.customId === "reportModal") {
        await interaction.deferReply({ ephemeral: true });
        const webhook = new WebhookClient({ url: config.discord.support.webhook.url });
        const message = interaction.fields.getTextInputValue("reportModalMessage");
        let
          owner,
          invite = await createORgetInvite(interaction.guild);

        try {
          owner = await (await interaction.guild.fetchOwner()).user ||
            await client.users.cache.get(interaction.guild.ownerId);
        } catch { }
        const embed = new EmbedBuilder()
          .setAuthor(
            {
              name: interaction.user.tag,
              iconURL: interaction.user.displayAvatarURL({ forceStatic: true })
            }
          )
          .setColor(copyRight.color.theme)
          .setDescription(
            replaceValues(language.replies.modals.reportEmbedDescription, {
              message: message.toString().length < 3900 ? message.toString() : message.toString().slice(0, 3900) + " and more...",
              user: `${interaction.user} | \`${interaction.user?.tag}\` | \`${interaction.user?.id}\``
            })

          )
          .addFields(
            [
              {
                name: `${copyRight.emotes.default.owner}| ${defaultLanguage.replies.guild.owner}`,
                value: `${copyRight.emotes.default.reply} **${owner} | \`${owner?.tag}\` | \`${owner?.id}\`**`,
                inline: false
              },
              {
                name: `${copyRight.emotes.default.server}| ${defaultLanguage.replies.guild.guild}`,
                value: `${copyRight.emotes.default.reply} **${invite ? `[${interaction.guild.name}](${invite.url})` : `${interaction.guild.name}`} | \`${interaction.guild.id}\` | \`${interaction.guild.memberCount}\` Members**`,
                inline: false
              },
              {
                name: `${copyRight.emotes.default.date}| ${defaultLanguage.replies.guild.createdAt}`,
                value: `${copyRight.emotes.default.reply} **<t:${Date.parse(interaction.guild.createdAt) / 1000}:D> | <t:${Date.parse(interaction.guild.createdAt) / 1000}:R>**`,
                inline: false
              }
            ]
          )
          .setThumbnail(interaction.guild.iconURL({ forceStatic: true }))
          .setTimestamp();

        await webhook.send({
          embeds: [embed],
          username: interaction.user.displayName,
          avatarURL: interaction.user.displayAvatarURL({ forceStatic: true }),
          threadId: config.discord.support.webhook.threads.report
        });
        return await interaction.editReply({
          content: language.replies.modals.sendReport
        });
      }
    }
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
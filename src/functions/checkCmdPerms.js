const
  {
    PermissionsBitField,
    ApplicationCommandOptionType
  } = require("discord.js"),
  error = require("./error"),
  selectLanguage = require("./selectLanguage"),
  config = require("../../config"),
  sendError = require("./sendError"),
  replaceValues = require("./replaceValues");

/**
 *
 * @param {import("discord.js").CommandInteraction} interaction
 * @param {import("../commands/Misc/help")} command
 * @param {string} prefix
 * @returns {import("discord.js").InteractionResponse}
 */
module.exports = async function (interaction, command, prefix = null) {
  try {
    const
      db = interaction.client.db,
      databaseNames = {
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies,
      mentionCommand = prefix ?
        `\`${prefix + command.data.name}\`` : `</${command.data.name}${interaction.options.data.some(a => a.type === 1) ?
          ` ${interaction.options.data.find(a => a.type === 1).name}` : ""}:${interaction.id}>`;


    if (!interaction.channel.permissionsFor(interaction.client.user).has(command.data.default_bot_permissions || [])) {
      await sendError({
        interaction,
        data: {
          content: replaceValues(language.botPerm, {
            mention_command: mentionCommand,
            bot_perms: new PermissionsBitField(command.data.default_bot_permissions)
              .toArray()
              .map(a => `"${a}"`)
              .join(", ")
          })
        }
      });

      return true;
    };

    if (!interaction.member.permissions.has(command.data.default_member_permissions || [])) {
      await sendError({
        interaction,
        data: {
          content: replaceValues(language.userPerm, {
            mention_command: `\`${mentionCommand}\``,
            user_perms: new PermissionsBitField(command.data.default_member_permissions)
              .toArray()
              .map(a => `"${a}"`)
              .join(", ")
          })
        }
      });

      return true;
    };

    return false;
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
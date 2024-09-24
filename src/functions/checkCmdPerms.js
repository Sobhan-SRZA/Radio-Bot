const
  { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js"),
  error = require("./error"),
  selectLanguage = require("./selectLanguage"),
  config = require("../../config"),
  sendError = require("./sendError");

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
      language = selectLanguage(lang).replies;

    const
      mentionCommand = prefix ?
        `\`${prefix + command.name}\`` : `</${command.name}${interaction.options.data.some(a => a.type === ApplicationCommandOptionType.Subcommand) ?
          ` ${interaction.options.data.find(a => a.type === ApplicationCommandOptionType.Subcommand).name}` : ""}:${interaction.id}>`,
      map = new Map(),
      keys = Object.keys(PermissionsBitField.Flags);

    Object.values(PermissionsBitField.Flags).forEach(a => {
      const value = keys.find(b => PermissionsBitField.Flags[b] === a);
      map.set(a, value);
    });
    if (!interaction.channel.permissionsFor(interaction.client.user).has(command.default_permission || []))
      return await sendError({
        interaction,
        data: {
          content: replaceValues(language.botPerm, {
            mention_command: mentionCommand,
            bot_perms: command.default_permission
              .map(a => `"${map.get(a)}"`)
              .join(", ")
          })
        }
      });

    if (!interaction.member.permissions.has(command.default_member_permissions || []))
      return await sendError({
        interaction,
        data: {
          content: replaceValues(language.userPerm, {
            mention_command: `\`${mentionCommand}\``,
            user_perms: command.default_member_permissions
              .map(a => `"${map.get(a)}"`)
              .join(", ")
          })
        }
      });

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

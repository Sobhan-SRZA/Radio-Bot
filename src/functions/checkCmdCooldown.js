const
  {
    ApplicationCommandOptionType,
    Collection
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
      client = interaction.client,
      db = client.db,
      databaseNames = {
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies,
      mentionCommand = prefix ?
        `\`${prefix + command.data.name}\`` : `</${command.data.name}${await interaction.options.data.some(a => a.type === 1) ?
          ` ${await interaction.options.data.find(a => a.type === 1).name}` : ""}:${interaction.id}>`;

    if (!client.cooldowns.has(command.data.name))
      await client.cooldowns.set(command.data.name, new Collection());

    const timestamps = await client.cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
    if (timestamps.has(interaction.member.id)) {
      const expirationTime = timestamps.get(interaction.member.id) + cooldownAmount;
      if (Date.now() < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        await sendError({
          interaction: interaction,
          log: replaceValues(language.cooldown, {
            mention_command: mentionCommand,
            expired_timestamp: expiredTimestamp
          })
        });

        return true;
      };
    };

    timestamps.set(interaction.member.id, Date.now());
    setTimeout(() => timestamps.delete(interaction.member.id), cooldownAmount);

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
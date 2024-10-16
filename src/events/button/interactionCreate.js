const
  { EmbedBuilder } = require("discord.js"),
  embed = require("../../storage/embed"),
  error = require("../../functions/error"),
  response = require("../../functions/response"),
  database = require("../../functions/database"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").ButtonInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isButton()) return;
    const
      db = new database(client.db),
      databaseNames = {
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies;

    if (interaction.customId === "botUpdates")
      return await response(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(`${embed.emotes.default.update}| Bot New Updates`)
            .setDescription(embed.update)
            .setColor(embed.color.theme)
        ]
      });

    if (interaction.customId.startsWith("owner"))
      if (!config.discord.support.owners.includes(interaction.user.id))
        return await sendError({
          interaction,
          log: language.onlyOwner
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
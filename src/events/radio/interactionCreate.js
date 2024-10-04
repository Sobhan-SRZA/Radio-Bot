const
  error = require("../../functions/error"),
  player = require("../../functions/player"),
  radiostation = require("../../storage/radiostation.json"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  checkPlayerPerms = require("../../functions/checkPlayerPerms"),
  replaceValues = require("../../functions/replaceValues");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId.startsWith("radioPanel")) {
      const
        choice = interaction.values[0],
        db = client.db,
        databaseNames = {
          station: `radioStation.${interaction.guildId}`,
          language: `language.${interaction.guildId}`
        },
        lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
        language = selectLanguage(lang);

      // Check perms
      if (await checkPlayerPerms(interaction))
        return;

      // Start to play station
      const radio = new player(interaction);
      await db.set(databaseNames.station, choice);
      radio.radio(radiostation[choice]);
      await interaction.reply({
        ephemeral: true,
        content: replaceValues(language.commands.play.replies.play, {
          song: choice
        })
      })
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
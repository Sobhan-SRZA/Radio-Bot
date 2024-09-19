const error = require("./error");

/**
 *
 * @param {{interaction: import("discord.js").CommandInteraction, message: import("discord.js").Message }} param0
 * @returns {import("discord.js").Message}
 */
module.exports = async function ({ interaction, message = null }) {
  try {
    if (interaction.user)
      return await interaction.deleteReply();

    else
      if (message.deletable && interaction.deletable) {
        await interaction.delete();
        return await message.delete();
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

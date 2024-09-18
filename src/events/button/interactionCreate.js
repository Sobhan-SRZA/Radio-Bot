const
  {
    EmbedBuilder
  } = require("discord.js"),
  error = require("../../functions/error"),
  statusEmbedBuilder = require("../../functions/statusEmbedBuilder");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").ButtonInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isButton()) return;

    if (interaction.customId === "refreshStatus") {
      await interaction.deferUpdate({ fetchReply: true });
      await interaction.editReply({
        embeds: [EmbedBuilder.from(await statusEmbedBuilder(client))]
      });
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
const
  { EmbedBuilder } = require("discord.js"),
  embed = require("../../storage/embed"),
  error = require("../../functions/error");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").ButtonInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isButton()) return;

    if (interaction.customId === "botUpdates") {
      await interaction.deferReply({ fetchReply: true, ephemeral: true });
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${embed.emotes.default.update}| Bot New Updates`)
            .setDescription(embed.update)
            .setColor(embed.color.theme)
        ]
      });
    };
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
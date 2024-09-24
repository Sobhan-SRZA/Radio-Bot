const
  error = require("../../functions/error"),
  radiostation = require("../../storage/radiostation.json"),
  choices = Object.keys(radiostation)
    .map((a) => JSON.stringify({
      name: `${a}`,
      value: `${a}`
    }))
    .map(a => JSON.parse(a));

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").CommandInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isAutocomplete()) return;

    switch (interaction.commandName) {
      case "play": {
        const focusedValue = interaction.options.getFocused();
        const firstChoice = choices.filter(a => a.name.toLowerCase().startsWith(focusedValue.toLowerCase()));
        return await interaction.respond(firstChoice.slice(0, 25)).catch(a => a);
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
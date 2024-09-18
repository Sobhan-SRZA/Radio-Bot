const
  error = require("../../functions/error"),
  sendGuildAlert = require("../../functions/sendGuildAlert");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Guild} guild 
 * @returns {void}
 */
module.exports = async (client, guild) => {
  try {
    return await sendGuildAlert({ client, guild, isWebhook: true, description: `-# **I have recently become a member of a new server, bringing my total server membership to \`${client.guilds.cache.size.toLocaleString()}\`.**` })
  } catch (e) {
    error(e)
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
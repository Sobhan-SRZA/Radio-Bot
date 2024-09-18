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
    return await sendGuildAlert({ client, guild, isWebhook: true, description: `-# **My membership in one server has been revoked. I remain a member of \`${client.guilds.cache.size.toLocaleString()}\` other servers.**` })
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
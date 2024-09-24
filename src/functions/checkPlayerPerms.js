const
  error = require("./error"),
  selectLanguage = require("./selectLanguage"),
  config = require("../../config"),
  sendError = require("./sendError");

/**
 *
 * @param {import("discord.js").CommandInteraction} interaction
 * @returns {import("discord.js").InteractionResponse}
 */
module.exports = async function (interaction) {
  try {
    const
      db = interaction.client.db,
      databaseNames = {
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang),
      member = interaction.guild.members.cache.get(interaction.member.id),
      channel = interaction.member?.voice?.channel;


    if (!channel)
      return await sendError({
        interaction,
        log: language.replies.noChannelError

      });

    if (!channel.viewable)
      return await sendError({
        interaction,
        log: language.replies.noPermToView
      });

    if (!channel.joinable)
      return await sendError({
        interaction,
        log: language.replies.noPermToConnect
      });

    if (channel.full)
      return await sendError({
        interaction,
        log: language.replies.channelFull
      });

    if (member.voice.deaf)
      return await sendError({
        interaction,
        log: language.replies.userDeaf
      });

    // if (channel.id !== radio.data.channelId)
    //   return await sendError({
    //     interaction,
    //     log: language.replies.notMatchedVoice
    //   });

    if (interaction.guild.members.me?.voice?.mute)
      return await sendError({
        interaction,
        log: language.replies.clientMute
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

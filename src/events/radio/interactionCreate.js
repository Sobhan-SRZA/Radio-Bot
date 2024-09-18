const
  {
    EmbedBuilder
  } = require("discord.js"),
  error = require("../../functions/error"),
  player = require("../../functions/player"),
  radiostation = require("../../storage/radiostation.json"),
  sendError = require("../../functions/sendError"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage");

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
        member = interaction.guild.members.cache.get(interaction.member.id),
        channel = member?.voice?.channel,
        db = client.db,
        databaseNames = {
          station: `radioStation.${interaction.guildId}`,
          language: `language.${interaction.guildId}`
        },
        lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
        language = selectLanguage(lang).interactions.menu;

      if (!channel)
        return await sendError({
          interaction,
          log: language.noChannelError

        });

      if (!channel.viewable)
        return await sendError({
          interaction,
          log: language.noPermToView
        });

      if (!channel.joinable)
        return await sendError({
          interaction,
          log: language.noPermToConnect
        });

      if (channel.full)
        return await sendError({
          interaction,
          log: language.channelFull
        });

      if (member.voice.deaf)
        return await sendError({
          interaction,
          log: language.userDeaf
        });

      let radio;
      try {
        radio = new player(interaction);
      } catch {
        return await sendError({
          interaction,
          log: language.noPlayerError
        });
      };
      
      if (channel.id !== radio.data.channelId)
        return await sendError({
          interaction,
          log: language.notMatchedVoice
        });

      if (interaction.guild.members.me?.voice?.mute)
        return await sendError({
          interaction,
          log: language.clientMute
        });

      await db.set(databaseNames.station, choice);
      radio.radio(radiostation[choice]);
      await interaction.reply({
        ephemeral: true,
        content: `Playing ${choice}`
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
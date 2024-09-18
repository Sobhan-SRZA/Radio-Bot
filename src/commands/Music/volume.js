const
  {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder
  } = require("discord.js"),
  radio = require("../../functions/player"),
  data = require("../../storage/embed"),
  response = require("../../functions/response");

module.exports = {
  name: "volume",
  description: "Check or change the volume",
  category: "music",
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  user_permissions: ["SendMessages"],
  bot_permissions: ["SendMessages", "EmbedLinks", "Connect", "Speak"],
  dm_permissions: false,
  only_owner: false,
  only_slash: true,
  only_message: true,
  options: [
    {
      name: "amount",
      description: "Volume amount to set",
      type: ApplicationCommandOptionType.Number,
      required: false,
      minValue: 1,
      maxValue: 200
    }
  ],

  /**
   * 
   * @param {import("discord.js").Client} client 
   * @param {import("discord.js").CommandInteraction} interaction 
   * @param {Array<string>} args 
   * @returns 
   */
  run: async (client, interaction, args) => {
    const memberChannelId = interaction.member?.voice?.channelId;
    if (!memberChannelId)
      return await response(interaction, {
        content: "You need to join a voice channel first!",
        ephemeral: true
      });

    const queue = new radio(interaction);
    const queueChannelId = queue?.data.channelId;
    if (!queue)
      return await response(interaction, {
        content: "I’m currently not playing in this server.",
        ephemeral: true
      });

    if (memberChannelId !== queueChannelId)
      return await response(interaction, {
        content: "You must be in the same voice channel as me!",
        ephemeral: true
      });

    const newVol = interaction.user ? interaction.options.getNumber("amount", false) : args[0];
    if (!newVol) {
      const embed = new EmbedBuilder()
        .setColor(data.color.theme)
        .setDescription(`Current volume is \`${queue.volume}%\`.`)
        .setFooter({ text: "Use '/volume <1-100>' to change the volume." });

      return await response(interaction, { ephemeral: true, embeds: [embed] }).catch(error);
    }

    queue.setVolume(Number(newVol));
    return await response(interaction, { content: `Volume is updated to ${newVol}.` });
  }
};
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */
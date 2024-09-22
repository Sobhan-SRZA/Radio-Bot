const
  {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits
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
  default_member_permissions: [PermissionFlagsBits.SendMessages],
  bot_permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.Speak
  ],
  dm_permission: false,
  nsfw: false,
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
    },
    {
      name: "ephemeral",
      description: ephemeral.description,
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: ephemeral.choices.yes,
          value: "true"
        },
        {
          name: ephemeral.choices.no,
          value: "false"
        }
      ],
      required: false
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

    let queue;
    try {
      queue = new radio(interaction);
    } catch {
      return await sendError({
        interaction,
        isUpdateNeed: true,
        log: language.replies.noPlayerError
      });
    }

    const queueChannelId = queue?.data.channelId;
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
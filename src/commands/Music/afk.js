const
  {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ChannelType,
    PermissionFlagsBits
  } = require("discord.js"),
  response = require("../../functions/response"),
  radio = require("../../functions/player"),
  sendError = require("../../functions/sendError"),
  selectLanguage = require("../../functions/selectLanguage"),
  config = require("../../../config"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  replaceValues = require("../../functions/replaceValues"),
  defaultLanguage = selectLanguage(config.source.default_language).commands.afk;

module.exports = {
  name: "afk",
  description: defaultLanguage.description,
  category: "music",
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  usage: "[channel | id]",
  default_member_permissions: [PermissionFlagsBits.SendMessages],
  default_permissions: [
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
      name: "channel",
      description: defaultLanguage.options.channel,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildVoice],
      required: false
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
   * @returns {void}
   */
  run: async (client, interaction, args) => {
    const
      db = client.db,
      databaseNames = {
        afk: `radioAFK.${interaction.guildId}`,
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).commands.afk,
      memberChannelId = interaction.member?.voice?.channelId;

    let channel = interaction.user ? interaction.options.getChannel("channel") : interaction.mentions.channels.first() || interaction.guild.channels.cache.get(args[0]);
    if (!channel && memberChannelId)
      channel = interaction.member?.voice?.channel;

    if (!channel && !memberChannelId)
      return await sendError({
        interaction,
        isUpdateNeed: true,
        log: language.replies.noChannelError
      });

    let queue;
    try {
      queue = new radio()
        .setData({
          channelId: channel.id,
          guildId: interaction.guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator
        });
    } catch {
      return await sendError({
        interaction,
        isUpdateNeed: true,
        log: language.replies.noPlayerError
      });
    }

    await db.set(databaseNames.afk, channel.id);
    return await response(interaction, {
      content: replaceValues(language.replies.success, {
        channel
      })
    });
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
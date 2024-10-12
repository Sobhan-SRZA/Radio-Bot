const
  {
    ApplicationCommandType,
    PermissionFlagsBits,
    ApplicationCommandOptionType,
    PermissionsBitField
  } = require("discord.js"),
  radio = require("../../functions/player"),
  selectLanguage = require("../../functions/selectLanguage"),
  config = require("../../../config"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  defaultLanguage = selectLanguage(config.source.default_language).commands.stop,
  response = require("../../functions/response");

module.exports = {
  name: "stop",
  description: defaultLanguage.description,
  category: "music",
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  default_member_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
  default_bot_permissions: new PermissionsBitField([
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.Speak
  ]),
  dm_permission: false,
  nsfw: false,
  only_owner: false,
  only_slash: true,
  only_message: true,
  options: [
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
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).commands.stop;

    // Check perms
    await checkPlayerPerms(interaction);

    // Stop The Player
    const queue = new radio(interaction);
    queue.stop();
    return await response(interaction, {
      content:language.replies.stopped
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
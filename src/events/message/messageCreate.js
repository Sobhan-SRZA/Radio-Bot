const
  {
    ChannelType
  } = require("discord.js"),
  error = require("../../functions/error"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  checkCmdPerms = require("../../functions/checkCmdPerms"),
  checkCmdCooldown = require("../../functions/checkCmdCooldown");

/**
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Message} message
 * @returns {void}
 */
module.exports = async (client, message) => {
  try {
    const
      db = client.db,
      databaseNames = {
        prefix: `prefix.${message.guildId}`,
        customCommand: `commands.${message.guildId}`,
        language: `language.${message.guildId}`
      };

    // Filter dm channels, webhooks, the bots
    if (message.channel.type === ChannelType.DM || !message || message?.webhookId || message.author?.bot) return;

    // Filter all guilds
    if (config.source.one_guild && message.guild.id !== config.discord.support.id) return;

    // Custom commands
    // if (await db.has(databaseNames.customCommand)) {
    //   const customCmd = await db.get(databaseNames.customCommand)
    //   customCmd.forEach(async command => {
    //     if (message.content.includes(command.name))
    //       return await message.reply(command.data);
    //   });
    // };

    // Select Guild Language
    const
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies,

      // Command Prefix & args
      stringPrefix = (await db.has(databaseNames.prefix)) ?
        await db.get(databaseNames.prefix) : `${config.discord.prefix}`,

      prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${stringPrefix.toString().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\s*`
      );

    if (!prefixRegex.test(message.content.toLowerCase())) return;

    const [prefix] = message.content.toLowerCase().match(prefixRegex);
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    if (!commandName) return;

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName)
      );

    // Command Handler
    if (command && command.only_message) {

      // Check Perms

      // Filter Owners Commands
      if (command.only_owner)
        if (!config.discord.support.owners.includes(message.author.id)) return;

      if (message.guild)
        await checkCmdPerms(message, command, prefix);

      // Cooldown
      await checkCmdCooldown(message, command, prefix);

      // Command Handler
      message.channel.sendTyping();
      command.run(client, message, args);
    }
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
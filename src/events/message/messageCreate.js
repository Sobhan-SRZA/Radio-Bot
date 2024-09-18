const
  {
    ChannelType,
    PermissionsBitField,
    Collection,
    EmbedBuilder
  } = require("discord.js"),
  error = require("../../functions/error"),
  config = require("../../../config"),
  sendError = require("../../functions/sendError"),
  embed = require("../../storage/embed"),
  selectLanguage = require("../../functions/selectLanguage"),
  replaceValues = require("../../functions/replaceValues");

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

    // Filter dm channels
    if (message.channel.type === ChannelType.DM) return;

    // Filter webhooks
    if (!message || message?.webhookId) return;

    // Filter the bots
    if (message.author?.bot) return;

    // Filter all guilds
    if (config.source.one_guild && !message.guild.equals(config.discord.support.id)) return;

    // Custom commands
    if (await db.has(databaseNames.customCommand)) {
      const customCmd = await db.get(databaseNames.customCommand)
      customCmd.forEach(async command => {
        if (message.content.includes(command.name))
          return await message.reply(command.data);
      });
    };

    // Select Guild Language
    const
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies;

    // Command Prefix & args
    const
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

      const mentionCommand = `\`${prefix + command.name}\``;
      if (message.guild) {
        const bot_perms = [];
        const user_perms = [];
        command.bot_permissions.forEach(perm =>
          bot_perms.push(PermissionsBitField.Flags[perm])
        );
        command.user_permissions.forEach(perm =>
          user_perms.push(PermissionsBitField.Flags[perm])
        );
        if (!message.guild.members.me.permissions.has([bot_perms] || []))
          return await sendError({
            interaction: message,
            log: replaceValues(language.botPerm, {
              mention_command: mentionCommand,
              bot_perms: command.bot_perms
                .map(p => `"${p}"`)
                .join(", ")
            })
          });

        if (!message.member.permissions.has([user_perms] || []))
          return await sendError({
            interaction: message,
            log: replaceValues(language.userPerm, {
              mention_command: `\`${mentionCommand}\``,
              user_perms: command.user_perms
                .map(p => `"${p}"`)
                .join(", ")
            })
          });
      };

      // Cooldown
      if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
      };

      const timestamps = client.cooldowns.get(command.name);
      const defaultCooldownDuration = 3;
      const cooldownAmount =
        (command.cooldown ?? defaultCooldownDuration) * 1000;
      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;
        if (Date.now() < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1000);
          return await sendError({
            interaction: message,
            data: {
              embeds: [
                new EmbedBuilder()
                  .setColor(embed.color.red)
                  .setFooter({
                    text: embed.footer.footerText,
                    iconURL: embed.footer.footerIcon
                  })
                  .setTitle(language.error)
                  .setDescription(
                    replaceValues(language.cooldown, {
                      mention_command: mentionCommand,
                      expired_timestamp: expiredTimestamp
                    })
                  )
              ]
            }
          });
        };
      };

      timestamps.set(message.author.id, Date.now());
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

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
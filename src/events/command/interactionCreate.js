const
  {
    EmbedBuilder,
    PermissionsBitField,
    ApplicationCommandOptionType,
    Collection
  } = require("discord.js"),
  error = require("../../functions/error"),
  config = require("../../../config"),
  sendError = require("../../functions/sendError"),
  embed = require("../../storage/embed"),
  replaceValues = require("../../functions/replaceValues"),
  selectLanguage = require("../../functions/selectLanguage");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").CommandInteraction} interaction 
 * @returns {void}
 */
module.exports = async (client, interaction) => {
  try {
    const
      db = client.db,
      databaseNames = {
        language: `language.${interaction.guild.id}`
      },

      // Select Guild Language
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).replies;

    // Load Slash Commands
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) {
        const args = [];
        for (let option of interaction.options.data) {
          if (option.type === ApplicationCommandOptionType.Subcommand) {
            if (option.name) args.push(option.name);

            option.options?.forEach((x) => {
              if (x.value) args.push(x.value);
            })
          } else if (option.value) args.push(option.value);
        };

        // Filter Owners Commands
        if (command.only_owner)
          if (!config.discord.support.owners.includes(interaction.user.id))
            return await sendError({
              interaction,
              log: language.onlyOwner
            });


        const fcmd = client.application.commands.cache.find(c => c.name === command.name);
        const mentionCommand = `</${fcmd.name}${interaction.options.data.some(a => a.type === ApplicationCommandOptionType.Subcommand) ? ` ${interaction.options.data.find(a => a.type === ApplicationCommandOptionType.Subcommand).name}` : ""}:${fcmd.id}>`;
        if (interaction.guild) {
          const bot_perms = [];
          const user_perms = [];
          command.bot_permissions.forEach(perm => bot_perms.push(PermissionsBitField.Flags[perm]));
          command.user_permissions.forEach(perm => user_perms.push(PermissionsBitField.Flags[perm]));
          if (!interaction.guild.members.me.permissions.has([bot_perms] || []))
            return await sendError({
              interaction,
              log: replaceValues(language.botPerm, {
                mention_command: mentionCommand,
                bot_perms: command.bot_perms
                  .map(p => `"${p}"`)
                  .join(", ")
              })
            });

          if (!interaction.member.permissions.has([user_perms] || []))
            return await sendError({
              interaction,
              log: replaceValues(language.userPerm, {
                mention_command: mentionCommand,
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
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
        if (timestamps.has(interaction.user.id)) {
          const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
          if (Date.now() < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            return await sendError({
              interaction,
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
          }
        };

        timestamps.set(interaction.user.id, Date.now());
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        // Command Handler 
        await interaction.deferReply({
          ephemeral: interaction.options.getString("ephemeral") === "true" ? true : false,
          fetchReply: true
        });
        command.run(client, interaction, args);
      } else return;

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
const
  {
    ActivityType,
    Routes,
    REST,
    PermissionsBitField
  } = require("discord.js"),
  clc = require("cli-color"),
  os = require("os"),
  post = require("../../functions/post"),
  error = require("../../functions/error"),
  logger = require("../../functions/logger"),
  config = require("../../../config"),
  chooseRandom = require("../../functions/chooseRandom"),
  selectLanguage = require("../../functions/selectLanguage"),
  defaultLanguage = selectLanguage(config.source.default_language),
  replaceValues = require("../../functions/replaceValues");

/**
 *
 * @param {import("discord.js").Client} client
 * @returns {void}
 */
module.exports = async client => {
  try {
    // Load Slash Commands
    const
      commands = client.commands.filter(a => a.only_slash),
      rest = new REST()
        .setToken(config.discord.token);

    commands.forEach(command => {
      command.default_member_permissions = new PermissionsBitField(command.default_member_permissions);
      command.default_permissions = new PermissionsBitField(command.default_permissions);
      return commands;
    });

    // Remove all of last commands
    // await client.application.commands.set([]); // Old way
    // await rest.delete(
    //   Routes.applicationCommands(client.user.id)
    // );

    // Start to upload all commands to api
    let data;
    post(
      replaceValues(defaultLanguage.replies.uploadSlashCmd, {
        count: clc.cyanBright(commands.size)
      }),
      "S"
    );
    if (config.source.one_guild) {
      // Create commands
      // data = await client.guilds.cache.get(config.discord.support.id).commands.set(commands); // Old way
      data = await rest.post(
        Routes.applicationGuildCommands(client.user.id, config.discord.support.id),
        {
          body: commands
        }
      );
    }
    else {
      // Create commands
      // data = await client.application.commands.set(commands); // Old way
      data = await rest.put(
        Routes.applicationCommands(client.user.id),
        {
          body: commands
        }
      );
    };
    post(
      replaceValues(defaultLanguage.replies.sucessUploadSlashCmd, {
        count: clc.cyanBright(data.length)
      }),
      "S"
    );

    // Change Bot Status
    setInterval(async function () {
      if (config.discord.status.activity.length < 1) return;

      const
        Presence = chooseRandom(config.discord.status.presence || ["online"]),
        Activity = chooseRandom(config.discord.status.activity),
        Type = chooseRandom(config.discord.status.type || ["Custom"]),
        stateName = replaceValues(Activity, {
          servers: client.guilds.cache.size.toLocaleString(),
          members: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString(),
          prefix: config.discord.prefix,
          usedCommands: (await client.db.get("totalCommandsUsed")).toLocaleString(),
          joiendVoiceChannels: client.guilds.cache.reduce((count, guild) => {
            return count + guild.channels.cache.filter(channel =>
              channel.isVoiceBased && channel.members.has(client.user.id)
            ).size;
          }, 0)
        });

      client.user.setPresence({
        status: Presence,
        activities: [
          {
            type: ActivityType[Type],
            name: stateName,
            state: Type === "Custom" ? stateName : ""
          }
        ]
      });
    }, 30000);
    post(
      `${clc.blueBright(
        defaultLanguage.replies.alertBotIsOnline
      )}` +
      `\n` +
      replaceValues(defaultLanguage.replies.botIsOnline, {
        name: clc.cyanBright(client.user.tag)
      }),
      "S"
    );
    logger(
      clc.blueBright("Working Guilds: ") +
      clc.cyanBright(`${client.guilds.cache.size.toLocaleString()} Servers`) +
      `\n` +
      clc.blueBright("Watching Members: ") +
      clc.cyanBright(
        `${client.guilds.cache
          .reduce((a, b) => a + b.memberCount, 0)
          .toLocaleString()} Members`
      ) +
      `\n` +
      clc.blueBright("Commands: ") +
      clc.cyanBright(
        `slashCommands[${commands.size}] & messageCommands[${client.commands.filter(a => a.only_message).size
        }]`
      ) +
      `\n` +
      clc.blueBright("Discord.js: ") +
      clc.cyanBright(`v${require("discord.js").version}`) +
      `\n` +
      clc.blueBright("Node.js: ") +
      clc.cyanBright(`${process.version}`) +
      `\n` +
      clc.blueBright("Plattform: ") +
      clc.cyanBright(`${process.platform} ${process.arch} | ${os.cpus().map((i) => `${i.model}`)[0]} | ${String(os.loadavg()[0])}%`) +
      `\n` +
      clc.blueBright("Memory: ") +
      clc.cyanBright(
        `**\`**`
          `${Math.round(
            (
              (os.totalmem() - os.freemem()) / 1024 / 1024
            )
              .toFixed(2)
          )
            .toLocaleString()
          }/${Math.round(
            (
              (os.totalmem()) / 1024 / 1024)
              .toFixed(2)
          )
            .toLocaleString()
          } MB | ${(
            (
              (os.totalmem() - os.freemem()) / os.totalmem()
            ) * 100)
            .toFixed(2)
          }%`
      )
    );
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
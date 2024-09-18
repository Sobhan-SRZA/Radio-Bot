const
  { ActivityType, Routes, REST } = require("discord.js"),
  clc = require("cli-color"),
  post = require("../../functions/post"),
  error = require("../../functions/error"),
  logger = require("../../functions/logger"),
  config = require("../../../config"),
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
      rest = new REST().setToken(config.discord.token);

    // Remove all of last commands
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: [] }
    );
    let data;
    post(`Started refreshing ${clc.cyanBright(commands.size)} application (/) commands.`, "S");
    if (config.source.one_guild) {
      // await client.guilds.cache.get(config.discord.support.id).commands.set(commands); // Old way
      data = await rest.put(
        Routes.applicationGuildCommands(client.user.id, config.discord.support.id),
        { body: commands }
      );
    }
    else {
      // await client.application.commands.set(commands); // Old way
      data = await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
    };
    post(`Successfully reloaded ${clc.cyanBright(data.length)} application (/) commands.`, "S");

    // Change Bot Status
    setInterval(function () {
      const Presence = config.discord.status.presence,
        selectedPresence =
          Presence[Math.floor(Math.random() * Presence.length)],
        Activity = config.discord.status.activity,
        selectedActivity =
          Activity[Math.floor(Math.random() * Activity.length)],
        Type = config.discord.status.type,
        selectedType =
          ActivityType[Type[Math.floor(Math.random() * Type.length)]],
        stateName = replaceValues(selectedActivity, {
          servers: client.guilds.cache.size.toLocaleString(),
          members: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString(),
          prefix: config.discord.prefix
        });

      client.user.setPresence({
        status: selectedPresence,
        activities: [
          {
            type: selectedType,
            name: stateName,
            state: selectedType === ActivityType.Custom ? stateName : ""
          }
        ]
      });
    }, 30000);
    post(
      `${clc.blueBright("Discord Bot is online!")}` +
      `\n` +
      `${clc.cyanBright(client.user.tag)} Is Now Online :)`,
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
      clc.cyanBright(`${process.platform} ${process.arch}`) +
      `\n` +
      clc.blueBright("Memory: ") +
      clc.cyanBright(
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(
          process.memoryUsage().rss /
          1024 /
          1024
        ).toFixed(2)} MB`
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

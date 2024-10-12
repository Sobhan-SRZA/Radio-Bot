const
  {
    ActivityType,
    PermissionFlagsBits,
    PermissionsBitField
  } = require("discord.js"),
  error = require("../../functions/error"),
  response = require("../../functions/response"),
  sendError = require("../../functions/sendError"),
  firstUpperCase = require("../../functions/firstUpperCase"),
  selectArg = require("../../functions/selectArg"),
  config = require("../../../config"),
  selectLanguage = require("../../functions/selectLanguage"),
  replaceValues = require("../../functions/replaceValues"),
  defaultLanguage = selectLanguage(config.source.default_language).commands.setactivity;

module.exports = {
  name: "setactivity",
  description: defaultLanguage.description,
  category: "owner",
  cooldown: 5,
  default_member_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
  default_bot_permissions: new PermissionsBitField([PermissionFlagsBits.SendMessages]),
  dm_permission: true,
  nsfw: false,
  only_owner: true,
  only_slash: false,
  only_message: true,

  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {Array<string>} args
   * @returns {void}
   */
  run: async (client, message, args) => {
    try {
      const
        status = selectArg({ args, name: "status" }),
        activityType = selectArg({ args, name: "type" }).toLowerCase(),
        activityName = selectArg({ args, filter: ["status", "url", "type"], name: "name" }),
        url = selectArg({ args, name: "url" }),
        types = {
          status: ["dnd", "online", "idle", "invisible"],
          activity: Object.keys(ActivityType).filter(a => isNaN(a)).map(a => a.toLowerCase())
        },
        db = client.db,
        databaseNames = {
          language: `language.${message.guild.id}`
        },
        lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
        language = selectLanguage(lang).commands.setactivity;

      if (!types.status.includes(status))
        return await sendError({
          interaction: message,
          log: replaceValues(language.replies.invalidStatus, {
            status: types.status.join(" | ")
          })
        });

      if (!types.activity.includes(activityType))
        return await sendError({
          interaction: message,
          log: replaceValues(language.replies.invalidStatus, {
            activity: types.activity.join(" | ")
          })
        });

      const data = {
        activities: [
          {
            name: activityName ? activityName : language.replies.activityName,
            type: activityType ? ActivityType[firstUpperCase(activityType)] : 4,
            state: ActivityType[firstUpperCase(activityType)] === 4 ? activityName : null,
            url: url ? url : null
          }
        ],
        status: status
      };
      await client.user.setPresence(data);
      return await response(message, {
        content: replaceValues(language.replies.success, {
          data: JSON.stringify(data).toString()
        })
      });
    } catch (e) {
      error(e)
    }
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
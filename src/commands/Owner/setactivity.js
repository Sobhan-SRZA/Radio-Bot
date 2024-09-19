const
  {
    ActivityType
  } = require("discord.js"),
  error = require("../../functions/error"),
  response = require("../../functions/response"),
  sendError = require("../../functions/sendError"),
  firstUpperCase = require("../../functions/firstUpperCase"),
  selectArg = require("../../functions/selectArg");

module.exports = {
  name: "setactivity",
  description: "تغییر موقت استاتوس بات.",
  category: "owner",
  cooldown: 5,
  defaultMemberPermissions: ["SendMessages"],
  bot_permissions: ["SendMessages"],
  dmPermission: true,
  nsfw: false,
  only_owner: true,
  only_slash: false,
  only_message: true,

  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {Array<string>} args
   * @returns
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
        };

      if (!types.status.includes(status))
        return await sendError({
          interaction: message,
          log: `ورودی اشتباه!\n+ ورودی درست: status:[statusName]\n+ statusName میتونه باشه: [${types.status.join(" | ")}]`
        });

      if (!types.activity.includes(activityType))
        return await sendError({
          interaction: message,
          log: `ورودی اشتباه!\n+ ورودی درست: type:[typeName]\n+ typeName میتونه باشه: [${types.activity.join(" | ")}]`
        });

      const data = {
        activities: [
          {
            name: activityName ? activityName : "Hello World",
            type: activityType ? ActivityType[firstUpperCase(activityType)] : 4,
            state: ActivityType[firstUpperCase(activityType)] === 4 ? activityName : null,
            url: url ? url : null
          }
        ],
        status: status
      };
      await client.user.setPresence(data);
      return await response(message, {
        content: `✅| استاتوس ربات به صورت موقت تغییر یافت.\n\`\`\`js\n${JSON.stringify(data).toString()}\`\`\``
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

/**
 * 
 * @param {{ args: Array<string>, name: string, filter: Array<string> }} param0 
 * @returns {string}
 */
module.exports = function ({ args, name = null, filter = null }) {
  if (name && !filter)
    return `${args.join(" ").split(name + ":")[1]?.split(" ")[0]}`;

  else
    return args
      .map(string => {
        const regex = new RegExp(`(?:${filter.join("|")}):([^ ]+)`, "g");
        const match = string.replace(regex, "null");
        return match;
      })
      .filter(a => a !== "null")
      .join(" ")
      .replace(name + ":", "");
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

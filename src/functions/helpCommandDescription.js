const error = require("./error");

/**
 * 
 * @param {Map} commands 
 * @param {import("../storage/locales/en.json")} language 
 * @param {string} value 
 * @param {string} prefix 
 * @returns {string}
 */
module.exports = async function (commands, language, value, prefix) {
  try {
    const description = [];
    await commands
      .filter(a => a.category === value)
      .forEach(async (command) => {
        const string = `**${command.only_slash ?
          `</${command.name}:${command?.id}>` : ""
          }${command.only_slash && command.only_message ?
            " | " : ""
          }${command.only_message ?
            `${prefix}${command.name} ${command.usage ? command.usage : ""}` : ""
          }${command.aliases && command.aliases.length > 0 ?
            `\n${language.replies.aliases} [${command.aliases.map(a => `\`${a}\``).join(", ")}]` : ""
          }\n${language.replies.description} \`${language.commands[command.name].description /* command.description */}\`**`;

        if (command.options && command.options.some(a => a.type === 1))
          await command.options
            .forEach((option) => {
              const string = `**${command.only_slash ?
                `</${command.name} ${option.name}:${command?.id}>` : ""
                }${command.only_slash && command.only_message ?
                  " | " : ""
                }${command.only_message ?
                  `${prefix}${command.name} ${option.name} ${command.usage ? command.usage : ""
                  }` : ""}${command.aliases && command.aliases.length > 0 ?
                    `\n${language.replies.aliases} [${command.aliases.map(a => `\`${a}\``).join(", ")}]` : ""
                }\n${language.replies.description} \`${language.commands[command.name].subCommands[option.name].description /* option.description */}\`**`;

              description.push(string);
            });

        else description.push(string);
      });

    return description.join("\n\n");
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
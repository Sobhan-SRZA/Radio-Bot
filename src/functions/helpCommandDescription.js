const error = require("./error");

/**
 * 
 * @param {import("discord.js").CommandInteraction} interaction 
 * @param {import("../../storage/locales/per.json").commands.help} language 
 * @param {string} value 
 * @param {string} prefix 
 * @returns {string}
 */
module.exports = async function (interaction, language, value, prefix) {
  try {
    const commands = await interaction.client.application.commands.fetch(
      {
        cache: true,
        withLocalizations: false,
        force: true,
        guildId: interaction.guildId
      }
    );
    const description = [];
    await interaction.client.commands
      .filter(a => a.category === value)
      .forEach(async (cmd) => {
        const command = commands.find(a => {
          return a.name === cmd.name
        });
        const string = `**${cmd.only_slash ?
          `</${cmd.name}:${command?.id}>` : ""
          }${cmd.only_slash && cmd.only_message ?
            " | " : ""
          }${cmd.only_message ?
            `${prefix}${cmd.name} ${cmd.usage ? cmd.usage : ""}` : ""
          }${cmd.aliases && cmd.aliases.length > 0 ?
            `\n${language.replies.aliases} [${cmd.aliases.map(a => `\`${a}\``).join(", ")}]` : ""
          }\n${language.replies.description} \`${cmd.description}\`**`;

        if (cmd.options && cmd.options.some(a => a.type === 1))
          await cmd.options
            .forEach((option) => {
              const string = `**${cmd.only_slash ?
                `</${cmd.name} ${option.name}:${command?.id}>` : ""
                }${cmd.only_slash && cmd.only_message ?
                  " | " : ""
                }${cmd.only_message ?
                  `${prefix}${cmd.name} ${option.name} ${cmd.usage ? cmd.usage : ""
                  }` : ""}${cmd.aliases && cmd.aliases.length > 0 ?
                    `\n${language.replies.aliases} [${cmd.aliases.map(a => `\`${a}\``).join(", ")}]` : ""
                }\n${language.replies.description} \`${option.description}\`**`;

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
const
  {
    EmbedBuilder,
    ApplicationCommandType,
    ActionRowBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ApplicationCommandOptionType,
    PermissionFlagsBits
  } = require("discord.js"),
  config = require("../../../config"),
  data = require("../../storage/embed"),
  firstUpperCase = require("../../functions/firstUpperCase"),
  response = require("../../functions/response"),
  sendError = require("../../functions/sendError"),
  replaceValues = require("../../functions/replaceValues"),
  selectLanguage = require("../../functions/selectLanguage"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  defaultLanguage = selectLanguage(config.source.default_language).commands.help;

module.exports = {
  name: "help",
  description: defaultLanguage.description,
  category: "misc",
  aliases: ["h"],
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  default_member_permissions: [PermissionFlagsBits.SendMessages],
  bot_permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
  dm_permission: false,
  nsfw: false,
  only_owner: false,
  only_slash: true,
  only_message: true,
  options: [
    {
      name: "ephemeral",
      description: ephemeral.description,
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: ephemeral.choices.yes,
          value: "true"
        },
        {
          name: ephemeral.choices.no,
          value: "false"
        }
      ],
      required: false
    }
  ],

  /**
   * 
   * @param {import("discord.js").Client} client 
   * @param {import("discord.js").CommandInteraction} interaction 
   * @param {Array} args 
   * @returns 
   */
  run: async (client, interaction, args) => {
    const timeout = 1000 * 60 * 1,
      category = new Map(),
      commands = new Map(),
      menu_options = [],
      description = [],
      name = [],
      db = client.db,
      databaseNames = {
        prefix: `prefix.${interaction.guildId}`,
        language: `language.${interaction.guild.id}`
      },
      lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
      language = selectLanguage(lang).commands.help,
      author = interaction.guild.members.cache.get(interaction.member.id),
      onlyOwner = client.commands.filter(a => a.only_owner),
      prefix = await db.has(databaseNames.prefix) ? await db.get(databaseNames.prefix) : config.discord.prefix,
      embed = new EmbedBuilder()
        .setAuthor({
          name: `${client.user.username} ${language.replies.embed.author}`
        })
        .setFooter({
          text: `${language.replies.embed.footer} ${author.user.tag}`,
          iconURL: author.user.displayAvatarURL({ dynamic: true })
        })
        .setColor(data.color.theme)
        .addFields(
          [
            {
              name: language.replies.embed.field1,
              value: replaceValues(language.replies.embed.value1, {
                username: client.user.username
              }),
              inline: false
            },
            {
              name: language.replies.embed.field2,
              value: language.replies.embed.value2,
              inline: false
            }
          ]
        )
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))

    client.commands.filter(a => !a.only_owner).forEach(a => category.set(a.category, a.category));
    if (config.discord.support.owners.some(r => r.includes(author.user.id)))
      onlyOwner.forEach(a => category.set(a.category, a.category));

    category.forEach((a) => {
      menu_options.push(
        JSON.stringify(
          {
            label: `${firstUpperCase(a.toString())}`,
            value: `${a.toString()}`
          }
        )
      );
      commands.set(a, client.commands.filter(a => a.category === a));
    });

    const helpMenu = new StringSelectMenuBuilder()
      .setCustomId("help_menu")
      .setMaxValues(1)
      .setPlaceholder(language.replies.menu)
      .addOptions(menu_options.map(a => JSON.parse(a)));

    const homeButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setLabel(language.replies.button)
      .setCustomId("home_page");

    const message = await response(interaction, {
      embeds: [embed],
      components: [
        new ActionRowBuilder()
          .addComponents(helpMenu.setDisabled(false)),

        new ActionRowBuilder()
          .addComponents(homeButton.setDisabled(true))
      ],
      fetchReply: true
    });
    const collector = await message.createMessageComponentCollector({ time: timeout });
    collector.on("collect", async (int) => {
      if (int.user.id === author.user.id) {
        if (int.isButton()) {
          if (int.customId === "home_page") {
            int.update({
              embeds: [embed],
              components: message.components
            })
          }
        };

        if (int.isStringSelectMenu()) {
          if (int.customId === "help_menu") {
            int.values.forEach(async (value) => {
              const embed = new EmbedBuilder()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setAuthor({
                  name: `${client.user.username} ${language.replies.embed.author}`
                })
                .setTitle(`${firstUpperCase(value)}`)
                .setFooter({
                  text: `${language.replies.embed.footer} ${author.user.tag}`,
                  iconURL: author.user.displayAvatarURL({ dynamic: true })
                })
                .setColor(data.color.theme)

              const description = "";
              client.commands
                .filter(a => a.category === value)
                .forEach(async (cmd) => {
                  const command = (await client.application.commands.fetch()).find(a => a.name === cmd.name);
                  if (cmd.only_slash && cmd.options && cmd.options.some(a => a.type === 1))
                    cmd.options.forEach((option) => {
                      description +=
                        `**${cmd.only_slash ?
                          `</${cmd.name} ${option.name}:${command.id}>` : ""}${cmd.only_message ?
                            `${prefix}${cmd.name} ${option.name} ${cmd.usage ? cmd.usage : ""}` : ""}${cmd.aliases && cmd.aliases.length > 0 ?
                              `\n${language.replies.aliases} [${cmd.aliases.map(a => `\`${a}\``).join(", ")}]` : ""}\n${language.replies.description} \`${option.description}\`**`;
                      // name.push(
                      //   JSON.stringify(
                      //     {
                      //       name: cmd.name + " " + option.name,
                      //       description: option.description
                      //     }
                      //   )
                      // )
                    })

                  // else name.push(
                  //   JSON.stringify(
                  //     {
                  //       name: `${cmd.name}`,
                  //       description: cmd.description

                  //     }
                  else description +=
                    `**${cmd.only_slash ?
                      `</${cmd.name}:${command.id}>` : ""}${cmd.only_message ?
                        `${prefix}${cmd.name} ${cmd.usage ? cmd.usage : ""}` : ""}${cmd.aliases && cmd.aliases.length > 0 ?
                          `\n${language.replies.aliases} [${cmd.aliases.map(a => `\`${a}\``).join(", ")}]` : ""}\n${language.replies.description} \`${cmd.description}\`**`;

                  // name
                  //   .map(a => JSON.parse(a))
                  //   .forEach(element => {
                  //     description
                  //       .push(
                  //         `**${cmd.only_slash ?
                  //           `</${element.name}:${command.id}>` : ""}${cmd.only_message ?
                  //             `${prefix}${element.name} ${cmd.usage ? cmd.usage : ""}` : ""}${cmd.aliases && cmd.aliases.length > 0 ?
                  //               `\n${language.replies.aliases} [${cmd.aliases.map(a => `\`${a}\``).join(", ")}]` : ""}\n${language.replies.description} \`${element.description}\`**`
                  //       );
                  //   });

                  description +=
                    `**${cmd.only_slash ?
                      `</${cmd.name}:${command.id}>` : ""}${cmd.only_slash && cmd.only_message ? " | " : ""}${cmd.only_message ?
                        `${prefix}${cmd.name} ${cmd.usage ? cmd.usage : ""}` : ""}${cmd.aliases && cmd.aliases.length > 0 ?
                          `\n${language.replies.aliases} [${cmd.aliases.map(a => `\`${a}\``).join(", ")}]` : ""}\n${language.replies.description} \`${cmd.description}\`**`;

                });

              console.log(description);
              embed.setDescription(`${description.length < 1 ? language.replies.noCommands : description}`);
              return int.update({
                embeds: [embed],
                components: [
                  new ActionRowBuilder()
                    .addComponents(
                      helpMenu
                        .setDisabled(false)
                        .setOptions(menu_options.map(a => JSON.parse(a)).filter(a => a.value !== value))
                    ),

                  new ActionRowBuilder()
                    .addComponents(homeButton.setDisabled(false))
                ]
              });
            });
          }
        }
      } else
        return await sendError({
          interaction,
          log: replaceValues(language.replies.invalidUser, {
            mention_command: `</${client.application.commands.cache.find(c => c.name === "help").name}:${client.application.commands.cache.find(c => c.name === "help").id}>`,
            author: author.user
          })
        })

    });
    collector.on("end", async () => {
      return await message.edit({
        components: [
          new ActionRowBuilder()
            .addComponents(helpMenu.setDisabled(true)),

          new ActionRowBuilder()
            .addComponents(homeButton.setDisabled(true))
        ]
      });
    })
    setTimeout(() => {
      return collector.stop();
    }, timeout);

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
const
  {
    EmbedBuilder,
    ApplicationCommandType,
    ActionRowBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    Collection
  } = require("discord.js"),
  config = require("../../../config"),
  data = require("../../storage/embed"),
  firstUpperCase = require("../../functions/firstUpperCase"),
  response = require("../../functions/response"),
  sendError = require("../../functions/sendError"),
  replaceValues = require("../../functions/replaceValues"),
  selectLanguage = require("../../functions/selectLanguage"),
  ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
  defaultLanguage = selectLanguage(config.source.default_language).commands.help,
  editResponse = require("../../functions/editResponse"),
  helpCommandDescription = require("../../functions/helpCommandDescription");

module.exports = {
  name: "help",
  description: defaultLanguage.description,
  category: "misc",
  aliases: ["h"],
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  default_member_permissions: [PermissionFlagsBits.SendMessages],
  default_permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
  dm_permission: true,
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
   * @returns {void}
   */
  run: async (client, interaction, args) => {
    const timeout = 1000 * 60 * 2,
      category = new Map(),
      menu_options = [],
      commands = new Collection(),
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
          iconURL: author.user.displayAvatarURL({ forceStatic: true })
        })
        .setColor(data.color.theme)
        .addFields(
          [
            {
              name: language.replies.embed.field1,
              value: replaceValues(language.replies.embed.value1, {
                username: client.user.username,
                emote: data.emotes.default.multipleMusicalNotes
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
        .setThumbnail(client.user.displayAvatarURL({ forceStatic: true }))

    await client.commands.forEach(async command => {
      const appCommand = await (await client.application.commands.fetch({ cache: true })).find(a => a.name === command.name);
      await commands.set(command.name, {
        id: appCommand?.id,
        ...command
      });
    });
    client.commands.filter(a => !a.only_owner).forEach(a => category.set(a.category, a.category));
    if (config.discord.support.owners.some(r => r.includes(author.user.id)))
      onlyOwner.forEach(a => category.set(a.category, a.category));

    category.forEach((a) => {
      menu_options.push(
        JSON.stringify(
          {
            label: `${firstUpperCase(a.toString())}`,
            value: `${a.toString()}`,
            emoji: data.emotes.default[a]
          }
        )
      );
    });

    const message = await response(interaction, {
      embeds: [embed.toJSON()],
      components: await await components(language, true, false, menu_options.map(a => JSON.parse(a))),
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
            await int.deferUpdate({ fetchReply: true });
            const value = int.values[0];
            const string = await helpCommandDescription(commands, selectLanguage(lang), value, prefix);
            const embed = new EmbedBuilder()
              .setThumbnail(client.user.displayAvatarURL({ forceStatic: true }))
              .setAuthor({
                name: `${client.user.username} ${language.replies.embed.author}`
              })
              .setTitle(`${data.emotes.default[value]}| ${firstUpperCase(value)} [${client.commands.filter(a => a.category === value).size}]`)
              .setFooter({
                text: `${language.replies.embed.footer} ${author.user.tag}`,
                iconURL: author.user.displayAvatarURL({ forceStatic: true })
              })
              .setColor(data.color.theme)

            embed.setDescription(`${string.length < 1 ? language.replies.noCommands : string}`);
            return await int.editReply({
              embeds: [embed.toJSON()],
              components: await components(language, false, false, menu_options.map(a => JSON.parse(a)).filter(a => a.value !== value))
            });
          }
        }
      } else
        return await sendError({
          isUpdateNeed: true,
          interaction,
          log: replaceValues(language.replies.invalidUser, {
            mention_command: `</${client.application.commands.cache.find(c => c.name === "help").name}:${client.application.commands.cache.find(c => c.name === "help").id}>`,
            author: author.user
          })
        })

    });
    collector.on("end", async () => {
      return await editResponse({
        interaction,
        message,
        data: {
          components: await components(language, true, true, menu_options.map(a => JSON.parse(a)))
        }
      });
    })
    setTimeout(() => {
      return collector.stop();
    }, timeout);

    // Functions
    /**
     * 
     * @param {object} language 
     * @param {boolean} disableHomePage 
     * @param {boolean} disableMenu 
     * @param {array} options 
     * @returns {array}
     */
    async function components(language, disableHomePage, disableMenu, options) {
      return [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Success)
              .setLabel(language.replies.buttons.home)
              .setEmoji(data.emotes.default.home)
              .setDisabled(disableHomePage)
              .setCustomId("home_page")
          )
          .toJSON(),

        new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("help_menu")
              .setMaxValues(1)
              .setPlaceholder(language.replies.menu)
              .setDisabled(disableMenu)
              .addOptions(options)
          )
          .toJSON()
      ]
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
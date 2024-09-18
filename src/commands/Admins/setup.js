const chunkArray = require("../../functions/chunkArray");

const
    {
        ApplicationCommandType,
        ApplicationCommandOptionType,
        ChannelType,
        EmbedBuilder,
        ActionRowBuilder,
        StringSelectMenuBuilder
    } = require("discord.js"),
    error = require("../../functions/error"),
    response = require("../../functions/response"),
    copyRight = require("../../storage/embed"),
    config = require("../../../config"),
    selectLanguage = require("../../functions/selectLanguage"),
    ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
    defaultLanguage = selectLanguage(config.source.default_language).commands.setup,
    radiostation = require("../../storage/radiostation.json"),
    replaceValues = require("../../functions/replaceValues"),
    choices = Object.keys(radiostation).map((a) => JSON.stringify({
        label: `${a}`,
        value: `${a}`
    })).map(a => JSON.parse(a));

module.exports = {
    name: "setup",
    description: defaultLanguage.description,
    category: "admin",
    aliases: ["set", "st"],
    type: ApplicationCommandType.ChatInput,
    cooldown: 10,
    user_permissions: ["ManageChannels", "ManageGuild", "SendMessages"],
    bot_permissions: ["ManageChannels", "SendMessages", "EmbedLinks"],
    only_message: true,
    only_slash: true,
    options: [
        {
            name: "panel",
            description: defaultLanguage.subCommands.panel.description,
            type: ApplicationCommandOptionType.Subcommand,
            usage: "[channel | id]",
            options: [
                {
                    name: "channel",
                    description: defaultLanguage.subCommands.panel.options.channel,
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: false
                },
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
            ]
        },
        {
            name: "prefix",
            description: defaultLanguage.subCommands.prefix.description,
            type: ApplicationCommandOptionType.Subcommand,
            usage: "[string]",
            options: [
                {
                    name: "input",
                    description: defaultLanguage.subCommands.prefix.options.input,
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
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
            ]
        }
    ],

    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {Array<string>} args 
     * @returns {void}
     */
    run: async (client, interaction, args) => {
        try {
            const
                db = client.db,
                databaseNames = {
                    panel: `radioPanel.${interaction.guildId}`,
                    prefix: `prefix.${interaction.guildId}`,
                    customCommand: `commands.${interaction.guild.id}`,
                    language: `language.${interaction.guild.id}`
                },
                lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
                language = selectLanguage(lang).commands.setup,
                prefix = (await db.has(databaseNames.prefix)) ? await db.get(databaseNames.prefix) : `${config.discord.prefix}`;

            switch (interaction.user ? interaction.options.getSubcommand() : args[0]) {
                case "panel": {
                    let channel;
                    if (interaction.user)
                        channel = interaction.options.getChannel("channel") || interaction.channel;
                    else
                        channel = interaction.mentions.channels.first() || interaction.guild.channels.cache.get(args[1]) || interaction.channel;

                    const
                        embed = new EmbedBuilder()
                            .setColor(copyRight.color.theme)
                            .setTitle(language.subCommands.panel.replies.panelTitle)
                            .setTimestamp(),

                        components = [];

                    chunkArray(choices, 25)
                        .forEach((array, index) => {
                            components.push(
                                new ActionRowBuilder()
                                    .addComponents(
                                        new StringSelectMenuBuilder()
                                            .setCustomId(`radioPanel-${++index}`)
                                            .setPlaceholder(language.subCommands.panel.replies.panelMenu)
                                            .setOptions(array)
                                            .setMaxValues(1)
                                    )
                            )
                        });

                    const message = await channel.send({
                        embeds: [embed],
                        components: components
                    });

                    await db.set(databaseNames.panel, { channel: channel.id, message: message.id });
                    return await response(interaction, {
                        content: replaceValues(language.subCommands.panel.replies.sucess, { channel })
                    });
                }

                default: {
                    const setup = require("./setup");
                    const embed = new EmbedBuilder()
                        .setColor(copyRight.color.theme)
                        .setTitle("Help | Setup")
                        .setDescription(setup.description)
                        .setFooter(
                            {
                                text: `Admin Embed • ${copyRight.footer.footerText}`
                            }
                        )
                        .setThumbnail(author.displayAvatarURL(
                            {
                                forceStatic: true
                            }
                        ))
                        .setTimestamp();

                    setup.options.forEach(a => {
                        embed.addFields(
                            {
                                name: `\`${prefix}setup ${a.name}\`${a.usage ? ` | ${a.usage}` : ""}:`,
                                value: `\`${language.subCommands[a.name].description}\``,
                                inline: true
                            }
                        )
                    });
                    return await response(
                        {
                            embeds: [embed]
                        }
                    )
                }
            }
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
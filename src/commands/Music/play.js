const
    {
        ApplicationCommandType,
        ApplicationCommandOptionType,
        PermissionFlagsBits
    } = require("discord.js"),
    radio = require("../../functions/player"),
    radiostation = require("../../storage/radiostation.json"),
    error = require("../../functions/error"),
    response = require("../../functions/response"),
    replaceValues = require("../../functions/replaceValues"),
    selectLanguage = require("../../functions/selectLanguage"),
    config = require("../../../config"),
    defaultLanguage = selectLanguage(config.source.default_language).commands.play,
    ephemeral = selectLanguage(config.source.default_language).replies.ephemeral,
    sendError = require("../../functions/sendError"),
    choices = Object.keys(radiostation).map((a) => JSON.stringify({
        name: `${a}`,
        value: `${a}`
    })).map(a => JSON.parse(a)),
    chunkArray = require("../../functions/chunkArray"),
    options = [],
    checkPlayerPerms = require("../../functions/checkPlayerPerms");

chunkArray(choices, 25)
    .forEach((array, index) => {
        options.push(
            JSON.stringify(
                {
                    name: `station-${++index}`,
                    description: defaultLanguage.options.station,
                    type: ApplicationCommandOptionType.String,
                    choices: array,
                    required: false
                }
            )
        )
    });

options.push(
    JSON.stringify(
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
    )
);

module.exports = {
    name: "play",
    description: defaultLanguage.description,
    category: "music",
    type: ApplicationCommandType.ChatInput,
    cooldown: 5,
    aliases: ["p"],
    default_member_permissions: [PermissionFlagsBits.SendMessages],
    default_permission: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.Speak
    ],
    dm_permission: false,
    nsfw: false,
    only_owner: false,
    only_slash: true,
    only_message: true,
    options: options.map(a => JSON.parse(a)),

    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {Array<string>} args 
     * @returns 
     */
    run: async (client, interaction, args) => {
        try {
            const
                query = interaction.user ? interaction.options.data.find(a => a.name.startsWith("station"))?.value : args.join(" "),
                db = client.db,
                databaseNames = {
                    station: `radioStation.${interaction.guildId}`,
                    panel: `radioPanel.${interaction.guildId}`,
                    language: `language.${interaction.guild.id}`
                },
                lang = await db.has(databaseNames.language) ? await db.get(databaseNames.language) : config.source.default_language,
                language = selectLanguage(lang).commands.play;

            if (await db.has(databaseNames.panel))
                if (interaction.channel.id !== (await db.get(databaseNames.panel)).channel)
                    return await sendError({
                        isUpdateNeed: true,
                        interaction,
                        log: replaceValues(language.replies.onlyPanel, {
                            channel: await db.get(databaseNames.panel).channel
                        })
                    });

            if (!choices.map(a => a.name).includes(query))
                return await sendError({
                    isUpdateNeed: true,
                    interaction,
                    log: replaceValues(language.replies.invalidQuery, {
                        stations: JSON.stringify(choices.map(a => a.name))
                    })
                });

            // Check perms
            await checkPlayerPerms(interaction);

            const player = new radio(interaction);
            await player.radio(radiostation[query]);
            await db.set(databaseNames.station, query);
            return await response(interaction, {
                content: replaceValues(language.replies.play, {
                    song: query
                })
            });
        } catch (e) {
            error(e);
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
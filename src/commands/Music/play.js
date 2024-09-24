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
    checkPlayerPerms = require("../../functions/checkPlayerPerms"),
    chooseRandom = require("../../functions/chooseRandom");

module.exports = {
    name: "play",
    description: defaultLanguage.description,
    category: "music",
    type: ApplicationCommandType.ChatInput,
    cooldown: 5,
    aliases: ["p"],
    default_member_permissions: [PermissionFlagsBits.SendMessages],
    default_permissions: [
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
    options: [
        {
            name: "station",
            description: defaultLanguage.options.station,
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
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
    ],

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

            if (!query)
                return await sendError({
                    isUpdateNeed: true,
                    interaction,
                    log: replaceValues(language.replies.invalidQuery, {
                        stations: JSON.stringify(choices.map(a => a.name))
                    })
                });

            // Check perms
            await checkPlayerPerms(interaction);

            // Start to playe
            const firstChoice = chooseRandom(
                choices
                    .filter(a =>
                        a.name.toLowerCase().startsWith(query.toLowerCase()
                        )
                    )
                    .map(a =>
                        a.name
                    )
            );
            const player = new radio()
                .setData({
                    guildId: interaction.guildId,
                    channelId: interaction.member.voice.channelId,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                });

            await player.radio(radiostation[firstChoice]);
            await db.set(databaseNames.station, firstChoice);
            return await response(interaction, {
                content: replaceValues(language.replies.play, {
                    song: firstChoice
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
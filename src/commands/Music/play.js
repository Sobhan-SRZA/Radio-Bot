const
    {
        ApplicationCommandType,
        ApplicationCommandOptionType
    } = require("discord.js"),
    radio = require("../../functions/player"),
    radiostation = require("../../storage/radiostation.json"),
    error = require("../../functions/error"),
    response = require("../../functions/response"),
    sendError = require("../../functions/sendError"),
    choices = Object.keys(radiostation).map((a) => JSON.stringify({
        name: `${a}`,
        value: `${a}`
    })).map(a => JSON.parse(a)),
    config = require("../../../config"),
    selectLanguage = require("../../functions/selectLanguage"),
    chunkArray = require("../../functions/chunkArray"),
    options = [];

chunkArray(choices, 25)
    .forEach((array, index) => {
        options.push(
            JSON.stringify(
                {
                    name: `station-${++index}`,
                    description: "Choose one of them.",
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
            description: "آیا این پیغام پنهان باشد؟",
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "بله",
                    value: "true"
                },
                {
                    name: "خیر",
                    value: "false"
                }
            ],
            required: false
        }
    )
);

module.exports = {
    name: "play",
    description: "پخش موزیک در ویس چنل.",
    category: "music",
    type: ApplicationCommandType.ChatInput,
    cooldown: 5,
    aliases: ["p"],
    user_permissions: ["SendMessages"],
    bot_permissions: ["SendMessages", "EmbedLinks", "Connect", "Speak"],
    dm_permissions: false,
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
                query = interaction.user ? interaction.options.data.find(a => a.name.startsWith("station")) : args.join(" "),
                member = interaction.guild.members.cache.get(interaction.member.id),
                channel = member?.voice?.channel,
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
                        log: `You can't use this command here!\n+Go to <#${(await db.get(databaseNames.panel)).channel}> and try again.`
                    });

            if (!choices.map(a => a.name).includes(query))
                return await sendError({
                    isUpdateNeed: true,
                    interaction,
                    log: `Invalid query!!\n+ Valid queries: ${choices.map(a => a.name).join(", ")}`
                });

            if (!channel)
                return await sendError({
                    isUpdateNeed: true,
                    interaction,
                    log: "You have to join a voice channel first."

                });

            if (!channel.viewable)
                return await sendError({
                    isUpdateNeed: true,
                    interaction,
                    log: "I need \"View Channel\" permission."
                });

            if (!channel.joinable)
                return await sendError({
                    isUpdateNeed: true,
                    interaction,
                    log: "I need \"Connect Channel\" permission."
                });

            if (channel.full)
                return await sendError({
                    isUpdateNeed: true,
                    interaction,
                    log: "Can't join, the voice channel is full."
                });

            if (member.voice.deaf)
                return await sendError({
                    isUpdateNeed: true,
                    interaction,
                    log: "You cannot run this command while deafened."
                });

            if (interaction.guild.members.me?.voice?.mute)
                return await sendError({
                    isUpdateNeed: true,
                    interaction,
                    log: "Please unmute me before playing."
                });

            const player = new radio(interaction);
            await player.radio(radiostation[query]);
            await db.set(databaseNames.station, query);
            return await response(interaction, { content: `On playing!` });
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